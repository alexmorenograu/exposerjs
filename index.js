import 'colors';

///ExposerJS
import config from './config.js';
import modelsRoutes from './src/modelRoutes.js';
import { customRoutes, use, list } from './src/customRoutes.js';
import hooks from './src/hooks.js';

//Middlewares
import notFound from './src/middleware/notFound.js';
import UserError from './src/errors/userError.js';
import { addModel } from './src/middleware/aclVerification.js';
import tokenVerification from './src/middleware/tokenVerification.js';

//Express
import express, { json, urlencoded } from 'express';
import cors from 'cors';

//User methods
import signIn from './src/user/signIn.js';
import signUp from './src/user/signUp.js';

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

    // triggers BETA
    //const exposer = hooks(prisma);

    // NotFound middleware
    app.use(notFound);

    console.log(`ExposerJS deployed in ${new Date() - st}s ⚡`.bgCyan);
    if (!hasExpress) {
        return app.listen(global.CONFIG.port, () => {
            console.log(`BackEnd is listen at port ${global.CONFIG.port}`.bgGreen);
            return app
        });
    }
};

function useUser() {
    const methods = { signUp, signIn, tokenVerify: { model: 'user' } };
    for (const method in methods) {
        use(Object.assign(methods[method], { [method]: global.ORM.user[method] }))
    }

}


const exposer = { use, run, UserError }
const acl = { addModel }
export { exposer, acl };