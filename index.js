import 'colors';

///ExposerJS
import config from './config.js';
import modelsRoutes from './src/modelRoutes.js';
import { customRoutes, use, list } from './src/customRoutes.js';
import hooks from './src/hooks.js';

//Middlewares
import notFound from './src/middleware/notFound.js';
import tokenVerification from './src/middleware/tokenVerification.js';

import UserError from './src/errors/userError.js';
import { addModel } from './src/acl/aclVerification.js';
import autoImport from './src/util/autoImport.js';
import useAcl from './src/acl/useAcl.js';
import useUser from './src/user/useUser.js';

//Express
import express, { json, urlencoded } from 'express';
import cors from 'cors';

//Default ORM [Prisma]
import { exporter } from 'exposerjs-orm-prisma';

async function run({ config: userConfig, PrismaClient, app }) {
    const st = new Date();
    const notHasExpress = !app
    global.CONFIG = Object.assign(config, userConfig);
    global.ORM = exporter(PrismaClient) //await

    if (userConfig.autoImport) {
        const { paths, getFile } = userConfig.autoImport
        await autoImport(paths, getFile)
    }
    if (notHasExpress) app = express()


    useUser();
    app.use(tokenVerification);

    await customRoutes(app);
    await modelsRoutes(app);
    await useAcl();

    //triggers BETA //const exposer = hooks(prisma);
    app.use(notFound);

    console.log(`ExposerJS deployed in ${new Date() - st}ms ⚡`.bgCyan);
    if (notHasExpress) return expressDeploy(app)
};

function expressDeploy(app) {
    app.use(cors());
    app.use(json());
    app.use(urlencoded({ extended: true }));
    return app.listen(global.CONFIG.port, () => {
        console.log(`BackEnd is listen at port ${global.CONFIG.port}`.bgGreen);
        return app
    });
}


const exposer = { use, run, UserError }
const acl = { addModel }
export { exposer, acl };