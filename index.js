import 'colors';

/* EXPOSER */
import config from './config.js';
import modelsRoutes from './src/modelRoutes.js';
import { customRoutes, use, list } from './src/customRoutes.js';
import hooks from './src/hooks.js';

//middleware
import notFound from './src/middleware/notFound.js';
import UserError from './src/errors/userError.js';
import tokenVerification from './src/middleware/tokenVerification.js';
import { addModel } from './src/middleware/aclVerification.js';

//express
import express, { json, urlencoded } from 'express';
import cors from 'cors';


async function run(app, prismaClient, userConfig) {
    const st = new Date();
    const hasExpress = app ? true : false
    global.CONFIG = Object.assign(config, userConfig);

    if (!prismaClient) throw new Error('Prisma is required!');

    if (!hasExpress) {
        app = express()
        app.use(cors());
        app.use(json());
        app.use(urlencoded({ extended: true }));
    }
    // Set config
    // TokenVerification middleware
    app.use(tokenVerification);

    // custom routes
    await customRoutes(app, prismaClient);

    // routes /find, /create, etc
    await modelsRoutes(app, prismaClient);

    // triggers BETA
    //const exposer = hooks(prisma);

    // NotFound middleware
    app.use(notFound);
    // console.log(list)

    console.log(`ExposerJS deployed in ${new Date() - st}s ⚡`.bgCyan);
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