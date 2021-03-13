import {Zentao12} from '../src';

describe('Zentao12', () => {
    const zentao = new Zentao12({
        url: process.env.ZENTAO_URL ?? 'https://pro.demo.zentao.net/',
        account: process.env.ZENTAO_ACCOUNT ?? 'demo',
        password: process.env.ZENTAO_PWD ?? '123456',
        debug: process.env.ZENTAO_DEBUG !== undefined,
        preserveToken: process.env.ZENTAO_PRESERVE_TOKEN !== 'false',
    });

    it('login', async () => {
        await zentao.login();
        expect(zentao.token).not.toBe('');
    });

    it('getDeptList', async () => {
        const res = await zentao.getDeptList();
        expect(res.status).toBe(1);
    });

    it('addDept', async () => {
        const res = await zentao.addDept({
            parentDeptID: 3,
            depts: [`新部门-${Date.now()}-1`, `新部门-${Date.now()}-2`],
        });
        expect(res.status).toBe(1);
    });

    it('getUserList', async () => {
        const res = await zentao.getUserList();
        expect(res.status).toBe(1);
    });

    it('getUserCreateParams', async () => {
        const res = await zentao.getUserCreateParams();
        expect(res.status).toBe(1);
    });

    it('addUser', async () => {
        const res = await zentao.addUser({
            account: `u${Date.now()}`,
            realname: `U${Date.now()}`,
            password: 'Zentao-123456',
        });
        expect(res.status).toBe(1);
    });

    it('getProductList', async () => {
        const res = await zentao.getProductList();
        expect(res.status).toBe(1);
    });

    it('getProduct', async () => {
        const res = await zentao.getProduct({productID: 1});
        expect(res.status).toBe(1);
    });

    it('getProductCreateParams', async () => {
        const res = await zentao.getProductCreateParams();
        expect(res.status).toBe(1);
    });

    it('addProduct', async () => {
        const res = await zentao.addProduct({
            code: `pro${Date.now()}`,
            name: `Pro${Date.now()}`,
        });
        expect(res.status).toBe(1);
    });

    it('getProjectList', async () => {
        const res = await zentao.getProjectList();
        expect(res.status).toBe(1);
    });

    it('getProject', async () => {
        const res = await zentao.getProject({projectID: 1});
        expect(res.status).toBe(1);
    });

    it('getProjectCreateParams', async () => {
        const res = await zentao.getProjectCreateParams();
        expect(res.status).toBe(1);
    });

    it('addProject', async () => {
        const res = await zentao.addProject({
            code: `prj${Date.now()}`,
            name: `Prj${Date.now()}`,
            begin: '2021-03-01',
            end: '2022-03-01',
        });
        expect(res.status).toBe(1);
    });

    it('call', async () => {
        const res = await zentao.call('getTaskList', {
            projectID: 1,
            status: 'all',
        });
        expect(res.status).toBe(1);
    });

    it('getTaskList', async () => {
        const res = await zentao.getTaskList({projectID: 1, status: 'all'});
        expect(res.status).toBe(1);
    });

    it('getTask', async () => {
        const res = await zentao.getTask({taskID: 1});
        expect(res.status).toBe(1);
    });

    it('getTaskCreateParams', async () => {
        const res = await zentao.getTaskCreateParams();
        expect(res.status).toBe(1);
    });

    it('addTask', async () => {
        const res = await zentao.addTask({
            project: 1,
            name: `Task${Date.now()}`,
        });
        expect(res.status).toBe(1);
    });

    it('getTaskFinishParams', async () => {
        const res = await zentao.getTaskFinishParams({taskID: 1});
        expect(res.status).toBe(1);
    });

    it('finishTask', async () => {
        const res = await zentao.finishTask({
            taskID: 115,
            consumed: 1,
            currentConsumed: 1,
        });
        expect(typeof res.status).toBe('number');
    });

    it('getBugList', async () => {
        const res = await zentao.getBugList({
            productID: 1,
        });
        expect(res.status).toBe(1);
    });

    it('getBugCreateParams', async () => {
        const res = await zentao.getBugCreateParams({productID: 1});
        expect(res.status).toBe(1);
    });

    it('addBug', async () => {
        const res = await zentao.addBug({
            product: 1,
            title: `Bug${Date.now()}`,
        });
        expect(res.status).toBe(1);
    });

    it('getBugResolveParams', async () => {
        const res = await zentao.getBugResolveParams({bugID: 1});
        expect(res.status).toBe(1);
    });

    it('resolveBug', async () => {
        const res = await zentao.resolveBug({
            bugID: 6,
            resolution: 'bydesign',
        });
        expect(res.status).toBe(1);
    });

    it('getBug', async () => {
        const res = await zentao.getBug({bugID: 1});
        expect(res.status).toBe(1);
    });
});
