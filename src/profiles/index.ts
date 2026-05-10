import { ZentaoError } from '../misc/errors.js';
import { isNodeRuntime } from '../misc/environment.js';
import { normalizeSiteUrl } from '../utils/index.js';
import type { ZentaoProfile, ZentaoProfileRecord, ZentaoProfilesStore } from '../types/index.js';

type NodeFs = typeof import('node:fs/promises');
type NodeOs = typeof import('node:os');
type NodePath = typeof import('node:path');

export const ZENTAO_PROFILES_STORAGE_KEY = 'ZENTAO_PROFILES';

const PROFILE_FILE_PARTS = ['.config', 'zentao', 'zentao.json'];

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function cloneJson<T>(value: T): T {
  if (value === undefined) return value;
  return JSON.parse(JSON.stringify(value)) as T;
}

function nowString(): string {
  return new Date().toISOString();
}

async function importNodeModule<T>(specifier: string): Promise<T> {
  const dynamicImport = new Function('specifier', 'return import(specifier)') as (specifier: string) => Promise<T>;
  return dynamicImport(specifier);
}

function getBrowserStorage(): Storage | undefined {
  try {
    return globalThis.localStorage;
  } catch {
    return undefined;
  }
}

async function getProfileFilePath(): Promise<string> {
  const path = await importNodeModule<NodePath>('node:path');
  const home = process.env.HOME
    ?? process.env.USERPROFILE
    ?? (await importNodeModule<NodeOs>('node:os')).homedir();

  if (!home) {
    throw new ZentaoError('E_PROFILE_STORAGE_UNAVAILABLE');
  }

  return path.join(home, ...PROFILE_FILE_PARTS);
}

function profileKeyFromParts(account: string, server: string): string {
  const normalizedAccount = account.trim();
  const normalizedServer = normalizeSiteUrl(server);
  if (!normalizedAccount) throw new ZentaoError('E_INVALID_PROFILE');
  return `${normalizedAccount}@${normalizedServer}`;
}

function normalizeProfile(profile: ZentaoProfile): ZentaoProfile {
  if (!isRecord(profile) || typeof profile.server !== 'string' || typeof profile.account !== 'string' || typeof profile.token !== 'string') {
    throw new ZentaoError('E_INVALID_PROFILE');
  }

  const token = profile.token.trim();
  if (!token) throw new ZentaoError('E_INVALID_PROFILE');

  const copy = cloneJson(profile) as ZentaoProfile & { key?: string };
  delete copy.key;
  return {
    ...copy,
    server: normalizeSiteUrl(profile.server),
    account: profile.account.trim(),
    token,
  };
}

function normalizeStore(raw: unknown): ZentaoProfilesStore {
  if (!isRecord(raw)) return { profiles: [] };

  const profiles = Array.isArray(raw.profiles)
    ? raw.profiles.flatMap((profile) => {
      try {
        return [normalizeProfile(profile as ZentaoProfile)];
      } catch {
        return [];
      }
    })
    : [];

  const currentProfile = typeof raw.currentProfile === 'string' ? raw.currentProfile : undefined;
  return currentProfile ? { currentProfile, profiles } : { profiles };
}

function parseStore(text: string): ZentaoProfilesStore {
  try {
    return normalizeStore(JSON.parse(text));
  } catch (error) {
    throw new ZentaoError('E_PROFILE_STORAGE_INVALID', undefined, error);
  }
}

async function readStore(): Promise<ZentaoProfilesStore> {
  if (isNodeRuntime()) {
    const fs = await importNodeModule<NodeFs>('node:fs/promises');
    const file = await getProfileFilePath();
    try {
      return parseStore(await fs.readFile(file, 'utf8'));
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return { profiles: [] };
      }
      throw error;
    }
  }

  const storage = getBrowserStorage();
  if (!storage) {
    throw new ZentaoError('E_PROFILE_STORAGE_UNAVAILABLE');
  }

  const text = storage.getItem(ZENTAO_PROFILES_STORAGE_KEY);
  return text ? parseStore(text) : { profiles: [] };
}

async function writeStore(store: ZentaoProfilesStore): Promise<void> {
  const normalizedStore = normalizeStore(store);
  const text = `${JSON.stringify(normalizedStore, null, 2)}\n`;

  if (isNodeRuntime()) {
    const fs = await importNodeModule<NodeFs>('node:fs/promises');
    const path = await importNodeModule<NodePath>('node:path');
    const file = await getProfileFilePath();
    await fs.mkdir(path.dirname(file), { recursive: true });
    await fs.writeFile(file, text, 'utf8');
    return;
  }

  const storage = getBrowserStorage();
  if (!storage) {
    throw new ZentaoError('E_PROFILE_STORAGE_UNAVAILABLE');
  }
  storage.setItem(ZENTAO_PROFILES_STORAGE_KEY, text);
}

function toRecord(profile: ZentaoProfile): ZentaoProfileRecord {
  const normalized = normalizeProfile(profile);
  return {
    ...cloneJson(normalized),
    key: getProfileKey(normalized),
  };
}

function findProfile(store: ZentaoProfilesStore, profileKey: string): ZentaoProfile | undefined {
  return store.profiles.find((profile) => getProfileKey(profile) === profileKey);
}

function setFallbackCurrentProfile(store: ZentaoProfilesStore): void {
  if (!store.currentProfile || !findProfile(store, store.currentProfile)) {
    const fallback = store.profiles.at(-1);
    store.currentProfile = fallback ? getProfileKey(fallback) : undefined;
  }
}

/** 根据 profile 的账号和禅道地址生成稳定 key。 */
export function getProfileKey(profile: Pick<ZentaoProfile, 'account' | 'server'>): string {
  return profileKeyFromParts(profile.account, profile.server);
}

/** 列出所有保存的本地 profile。 */
export async function getAllProfiles(): Promise<ZentaoProfileRecord[]> {
  const store = await readStore();
  return store.profiles.map(toRecord);
}

/** 获取指定 profile；不传 key 时返回上次使用的 profile。 */
export async function getProfile(profileKey?: string): Promise<ZentaoProfileRecord | undefined> {
  const store = await readStore();
  const key = profileKey ?? store.currentProfile;
  if (!key) return undefined;
  const profile = findProfile(store, key);
  return profile ? toRecord(profile) : undefined;
}

/** 添加或覆盖一个本地 profile，并把它设置为当前使用的 profile。 */
export async function addProfile(profile: ZentaoProfile): Promise<ZentaoProfileRecord> {
  const store = await readStore();
  const timestamp = nowString();
  const normalized = normalizeProfile({
    ...profile,
    loginTime: profile.loginTime ?? timestamp,
    lastUsedTime: profile.lastUsedTime ?? timestamp,
  });
  const profileKey = getProfileKey(normalized);
  const index = store.profiles.findIndex((item) => getProfileKey(item) === profileKey);

  if (index >= 0) {
    store.profiles[index] = normalized;
  } else {
    store.profiles.push(normalized);
  }

  store.currentProfile = profileKey;
  await writeStore(store);
  return toRecord(normalized);
}

/** 删除指定 profile；返回是否实际删除了记录。 */
export async function deleteProfile(profileKey: string): Promise<boolean> {
  const store = await readStore();
  const nextProfiles = store.profiles.filter((profile) => getProfileKey(profile) !== profileKey);
  if (nextProfiles.length === store.profiles.length) return false;

  store.profiles = nextProfiles;
  setFallbackCurrentProfile(store);
  await writeStore(store);
  return true;
}

/** 切换当前使用的 profile，并刷新最后使用时间。 */
export async function switchProfile(profileKey: string): Promise<ZentaoProfileRecord> {
  const store = await readStore();
  const profile = findProfile(store, profileKey);
  if (!profile) {
    throw new ZentaoError('E_PROFILE_NOT_FOUND', { profileKey });
  }

  profile.lastUsedTime = nowString();
  store.currentProfile = profileKey;
  await writeStore(store);
  return toRecord(profile);
}

/** @deprecated Use {@link getProfile}. Kept for the typo in the original plan. */
export const getProfle = getProfile;

/** @deprecated Use {@link addProfile}. Kept for the typo in the original plan. */
export const addProfle = addProfile;
