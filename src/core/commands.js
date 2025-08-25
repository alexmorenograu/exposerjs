import 'colors';
import getUserConfig from './getConfig.js';
import autoImport from '../../src/util/autoImport.js';
import useAcl from '../../src/acl/useAcl.js';
import useUser from '../../src/user/useUser.js';

//Middlewares
import notFound from '../../src/middleware/notFound.js';
import tokenVerification from '../../src/middleware/tokenVerification.js';

//Default ORM [Prisma]
import { exporter } from 'exposerjs-orm-prisma';
import { customRoutes } from './deploy/methods.js';
import modelsRoutes from './deploy/models.js';

async function init({ PrismaClient, adapter }) {
    getUserConfig();
    global.APP = adapter.getApp()
    global.ORM = exporter(PrismaClient)
    global.ADAPTER = adapter

    if (global.CONFIG.autoImport) {
        const { paths, getFile } = global.CONFIG.autoImport
        await autoImport(paths, getFile)
    }

    return global.APP
};

async function deploy({ beforeMiddleware, afterMiddleware }, st, logs = true) {
    await beforeMiddleware?.(global.APP)

    await Promise.all([
        useUser(),
        global.ADAPTER.addMiddleware(tokenVerification),
        customRoutes(global.ADAPTER.createRoute),
        modelsRoutes(global.ADAPTER.createRoute),
        useAcl(),
        global.ADAPTER.addMiddleware(notFound),
    ]);

    await afterMiddleware?.(global.APP)

    return global.ADAPTER.listen(global.CONFIG, () => {
        if (st && logs) console.log(`Deployed in ${new Date() - st}ms ⚡`.bgCyan);
        if (logs) console.log(`Listening at port ${global.CONFIG.port}`.bgGreen);
    })
};

async function stop() {
    return await global.ADAPTER.stop()
};

export { init, deploy, stop }