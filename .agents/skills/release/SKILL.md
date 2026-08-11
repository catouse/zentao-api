---
name: release
description: 为 zentao-api 准备并可选发布新版本：检查 Git 状态，分析上个 tag 以来的变更，按 SemVer 确认版本号，更新 package.json 与 CHANGES.md，重新生成和构建文档，运行发布验证，创建发布提交与 Git tag，并在明确授权后发布到 npm。用户提出发布版本、准备 release、升级版本号、整理变更日志并打 tag，或发布 npm 包时使用。
---

# 发布 zentao-api

从仓库根目录执行流程，遵守项目 `AGENTS.md`，仅使用 Bun 管理依赖和运行项目脚本。尊重用户指定的执行范围；用户要求完整发布时，执行下述本地准备流程。不要擅自丢弃已有改动、推送远端或发布 npm 包。

## 1. 检查发布前状态

1. 运行 `git rev-parse --show-toplevel`，确认正在操作 `zentao-api` 仓库根目录。
2. 运行 `git status --short --branch`，记录分支和工作区状态。
3. 如存在未提交或未跟踪文件，列出它们并暂停；请用户先提交、暂存或明确授权把哪些改动纳入发布。不要自行暂存、覆盖或丢弃这些改动。
4. 确认当前提交包含值得发布的变更；如上个发布 tag 后没有实际变更，停止并说明。

## 2. 收集版本和变更范围

1. 运行 `git describe --tags --abbrev=0` 获取最近 tag。没有 tag 时，以全部历史为范围。
2. 对有 tag 的仓库运行 `git log <最近-tag>..HEAD --oneline`；没有 tag 时运行 `git log --oneline`。
3. 同时检查提交正文、变更统计和必要的源码差异，不能只根据提交标题判断是否存在破坏性变更。
4. 读取 `package.json` 的当前版本，并检查 `CHANGES.md` 的既有格式和措辞。

## 3. 确认新版本号

- 用户已指定版本号时，校验它是合法、递增且尚未被使用的 SemVer；`package.json` 使用裸版本号，tag 使用 `v<版本号>`。
- 用户未指定版本号时，按实际影响推荐版本：
  - 存在不兼容的公共 API 变更：递增 major。
  - 存在向下兼容的新功能、新模块或新公共能力：递增 minor。
  - 仅包含向下兼容的修复、文档、测试、内部重构或维护：递增 patch。
- 不要只依赖 `feat`、`fix` 等提交前缀；以代码和用户可见行为为准。
- 用户未预先指定版本时，展示“当前版本 → 推荐版本”、变更依据和 SemVer 理由，并等待明确确认后再修改文件。
- 修改前确认 `v<版本号>` 不存在；如版本或 tag 已存在，停止处理冲突。

## 4. 更新版本和变更日志

1. 仅修改 `package.json` 的 `version` 字段，不手工修改 `src/version.ts`；构建脚本会从 `package.json` 注入 `VERSION`。
2. 在 `CHANGES.md` 的 `# 变更日志` 标题后插入最新条目：

   ```markdown
   ## <版本号> - <YYYY-MM-DD>

   ### 新增

   - ...

   ### 修复

   - ...

   ### 变更

   - ...

   ### 测试

   - ...

   ### 文档

   - ...
   ```

3. 只保留有实际内容的分类。使用简洁中文描述用户影响，合并重复提交，忽略纯发布 housekeeping，并沿用现有日志风格。
4. 不手工编辑 `docs/reference/` 或 `docs/zentao-api/` 的生成文件。

## 5. 重新生成并验证

依次运行：

```bash
bun run docs:generate
bun run docs:build
bun run check
```

要求所有命令成功。`bun run check` 中的构建和 smoke test 必须确认导出的 `VERSION` 与 `package.json` 一致。命令失败时先诊断并修复根因，不要创建发布提交或 tag。

随后检查 `git status --short` 和完整 diff：

- 确认 `package.json`、`CHANGES.md` 和生成的 `docs/` 变更正确。
- 将生成的文档变更与发布修改放在同一个提交中。
- 如出现不属于本次发布的变化，暂停并说明，不要擅自纳入。

## 6. 创建发布提交和 tag

1. 仅暂存确认过的发布文件：`git add package.json CHANGES.md docs`。
2. 运行 `git diff --cached --check`，再检查暂存 diff 和统计；有错误或意外文件时先处理。
3. 使用项目约定提交：`git commit -m "* release v<版本号>"`。
4. 提交成功后运行 `git tag v<版本号>` 创建 tag。
5. 不自动推送。报告新版本号、变更日志摘要、验证结果、提交和 tag，并提示用户可执行 `git push && git push --tags`。

## 7. 可选发布到 npm

只有用户明确要求或确认发布 npm 包后才继续。需要认证时运行 `npm login`，随后运行：

```bash
bun publish
```

发布成功后报告 [zentao-api npm 包](https://www.npmjs.com/package/zentao-api)；发布失败时保留本地提交和 tag，说明失败步骤，不重复发布或改写版本历史。
