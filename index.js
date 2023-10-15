import 'colors';
/* EXPOSER */
import config from './config.js';
import modelsRoutes from './src/modelsRoutes.js';
import customRoutes from './src/customRoutes.js';
// import hooks from './src/hooks.js';

//middleware
import notFound from './src/middleware/notFound.js';


const customRoutesList = {}
function use(method) {
    let methodName;
    for (const prop in method)
        if (!['model', 'accpets', 'returns', 'http'].includes(prop)) methodName = prop;

    const newMethod = {}
    newMethod[methodName] = method
    customRoutesList[method.model] = Object.assign({}, customRoutesList[method.model], newMethod)
};


function run(app, prismaClient, userConfig) {



    // get config
    let conf = Object.assign(config, userConfig);

    // custom routes
    customRoutes(app, prismaClient, customRoutesList);

    // routes /find, /create, etc
    modelsRoutes(app, prismaClient, conf);

    // triggers BETA
    //const exposer = hooks(prisma);

    // NotFound middleware
    console.log('Exposer is running...'.bgCyan);
    app.use(notFound);
};

export default { use, run };