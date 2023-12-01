import 'colors';

///ExposerJS
import config from './config.js';
import modelsRoutes from './src/modelRoutes.js';
import { customRoutes, use, list } from './src/customRoutes.js';
import hooks from './src/hooks.js';

//Middlewares
import notFound from './src/middleware/notFound.js';
import UserError from './src/errors/userError.js';
import { addModel } from './src/acl/aclVerification.js';
import tokenVerification from './src/middleware/tokenVerification.js';
import useUser from './src/user/useUser.js';
import useAcl from './src/acl/useAcl.js';

//Express
import express, { json, urlencoded } from 'express';
import cors from 'cors';

//Default ORM [Prisma]
import { exporter } from 'exposerjs-orm-prisma';

async function run(prismaClient, app, userConfig) {
    if (!prismaClient) throw new Error('Prisma is required!');

    const st = new Date();
    const hasExpress = app ? true : false
    global.CONFIG = Object.assign(config, userConfig);
    global.ORM = exporter(prismaClient)

    if (!hasExpress) {
        app = express()
        app.use(cors());
        app.use(json());
        app.use(urlencoded({ extended: true }));
    }

    useUser();
    app.use(tokenVerification);

    await customRoutes(app);
    await modelsRoutes(app);
    await useAcl();

    //triggers BETA //const exposer = hooks(prisma);
    app.use(notFound);

    console.log(`ExposerJS deployed in ${new Date() - st}ms ⚡`.bgCyan);
    if (!hasExpress) {
        return app.listen(global.CONFIG.port, () => {
            console.log(`BackEnd is listen at port ${global.CONFIG.port}`.bgGreen);
            return app
        });
    }
};

const exposer = { use, run, UserError }
const acl = { addModel }
export { exposer, acl };