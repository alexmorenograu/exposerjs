import pluralize from 'pluralize';
import validator from './util/validator.js';
import parametizer from './util/parametizer.js';
import BAD_REQUEST from "./errors/badRequest.js";
import INTERNAL_ERROR from "./errors/internalError.js";

const camelToSnakeCase = str => str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);

export default (app, prismaClient, customRoutes) => {
    // Generate exposer proxy
    const prismaInstance = new prismaClient();
    const exposer = new Proxy({}, {
        get: function (target, property) {
            return new Proxy({ model: property }, {
                get: function (target, property) {
                    const model = target.model
                    if (prismaInstance?.[model]?.[property]) return prismaInstance[model][property]
                    return customRoutes[model][property][property];
                }
            });
        }
    });

    // Deploy custom routes
    for (const model in customRoutes) {
        for (const method in customRoutes[model]) {
            const newMethod = customRoutes[model][method];
            if (!newMethod.http) continue
            const path = '/api/' + pluralize(newMethod.model) + newMethod.http.path ?? camelToSnakeCase(method)
            app[newMethod.http.verb.toLowerCase()](path, async (req, res) => {
                try {
                    const params = parametizer(req, newMethod.accepts);
                    // ACL validation
                    // Token validation
                    validator(params, newMethod.accepts, BAD_REQUEST);
                    const response = await newMethod[method](
                        {
                            accessUser: {},
                            exposer,
                            req,
                            res
                        },
                        ...Object.values(params)
                    );
                    validator(response, newMethod.returns, INTERNAL_ERROR);
                    return res.send(response)
                } catch (e) {
                    console.log(e)
                    if (e.statusCode)
                        return res.status(e.statusCode).send(e);
                    return res.status(500).send(INTERNAL_ERROR);

                }

            });
            // NOT WORK GLOBALY 
            //const prisma = new prismaClient();
            // https://www.prisma.io/docs/concepts/components/prisma-client/custom-models
            // const myPrisma = prisma.$extends({ model: { [model]: { [method]: newMethod[method] } } })
            // console.log(prisma.user.getUser({ prisma }))
        }
    }
}