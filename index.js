import 'colors';
import * as emoji from 'node-emoji';

/* EXPOSER */
import config from './config.js';
import modelsRoutes from './src/modelRoutes.js';
import { customRoutes, use, list } from './src/customRoutes.js';
import hooks from './src/hooks.js';

//middleware
import notFound from './src/middleware/notFound.js';
import tokenVerification from './src/middleware/tokenVerification.js';


function run(app, prismaClient, userConfig) {
    const st = new Date()
    // Set config
    global.CONFIG = Object.assign(config, userConfig);
    // TokenVerification middleware
    app.use(tokenVerification);

    // custom routes
    customRoutes(app, prismaClient);

    // routes /find, /create, etc
    modelsRoutes(app, prismaClient);

    // triggers BETA
    //const exposer = hooks(prisma);

    // NotFound middleware
    // console.log(list)
    console.log(`Exposer deployed in ${new Date() - st}s ⚡`.bgCyan);
    app.use(notFound);
};

export default { use, run };