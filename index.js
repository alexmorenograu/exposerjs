import 'colors';

/* EXPOSER */
import config from './config.js';
import modelsRoutes from './src/modelRoutes.js';
import { customRoutes, use, list } from './src/customRoutes.js';
import hooks from './src/hooks.js';

//middleware
import notFound from './src/middleware/notFound.js';
import tokenVerification from './src/middleware/tokenVerification.js';
import { addModel } from './src/middleware/aclVerification.js';


async function run(app, prismaClient, userConfig) {
    const st = new Date()
    // Set config
    global.CONFIG = Object.assign(config, userConfig);
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
};

import UserError from './src/errors/userError.js';
const exposer = { use, run, UserError }
const acl = { addModel }
export { exposer, acl };