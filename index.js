/* EXPOSER */
import config from './config.js';
import modelsRoutes from './src/modelsRoutes.js';
import customRoutes from './src/customRoutes.js';
import hooks from './src/hooks.js';
import 'colors';

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
    const prismaInstance = new prismaClient();
    // custom routes
    const exposerProxy = new Proxy({}, {
        get: function (target, property) {
            return new Proxy({ model: property }, {
                get: function (target, property) {
                    const model = target.model
                    if (prismaInstance?.[model]?.[property]) return prismaInstance[model][property]
                    return customRoutesList[model][property][property];
                }
            });
        }
    });
    customRoutes(app, exposerProxy, customRoutesList);

    // routes /find, /create, etc
    modelsRoutes(app, prismaClient, conf);

    // triggers BETA
    //const exposer = hooks(prisma);
    console.log('Exposer is running...'.bgCyan);
    app.use(function (req, res) {
        res.status(404).send('The requested route could not be found. Please verify your request and try again.');
    });
};

export default { use, run };