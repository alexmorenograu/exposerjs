import pluralize from 'pluralize';
import validator from './validator.js';
import parametizer from './parametizer.js';
const camelToSnakeCase = str => str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);

export default (app, exposer, customRoutes) => {
    // Deploy custom routes
    for (const model in customRoutes) {
        for (const method in customRoutes[model]) {
            const newMethod = customRoutes[model][method];
            const path = '/api/' + pluralize(newMethod.model) + newMethod.http.path ?? camelToSnakeCase(method)
            app[newMethod.http.verb.toLowerCase()](path, async (req, res) => {
                const params = parametizer(req);
                // ACL validation
                // AJV validation
                // Token validation
                validator(params);
                const ctx = {
                    accessUser: {},
                    exposer,
                    req,
                    res
                }

                try {
                    return res.send(await newMethod[method](ctx, ...Object.values(params)));
                } catch (e) {
                    return res.status(400).send(e);
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