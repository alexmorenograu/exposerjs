import pluralize from 'pluralize';
import validator from '../util/validator.js';
import { addAcls } from '../acl/aclVerification.js';

import BAD_REQUEST from "../errors/badRequest.js";
import INTERNAL_ERROR from "../errors/internalError.js";
import handler from './handler.js';

const camelToSnakeCase = str => str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
const list = {}
let exposer;

async function customRoutes(app) {
    // Generate exposer proxy
    const config = global.CONFIG;
    exposer = new Proxy({}, {
        get: function (target, property) {
            return new Proxy({ model: property }, {
                get: function (target, property) {
                    const model = target.model
                    if (global.ORM.models?.[model]?.[property]) return global.ORM.models[model][property]
                    return list[model][property][property];
                }
            });
        }
    });

    // Deploy custom routes
    for (const model in list) {
        for (const method in list[model]) {
            const newMethod = list[model][method];

            if (!newMethod.http) continue
            const path = config.prefix + '/' + pluralize(newMethod.model) + newMethod.http.path ?? camelToSnakeCase(method)

            await app[newMethod.http.verb.toLowerCase()](path, async (req, res) => {
                return await handler(req, res, newMethod.model, method, newMethod.accepts,
                    async (params, accessUser) => {
                        validator(params, newMethod.accepts, BAD_REQUEST);
                        const response = await newMethod[method](
                            {
                                accessUser,
                                exposer,
                                req,
                                res
                            },
                            ...Object.values(params)
                        );
                        validator(response, newMethod.returns, INTERNAL_ERROR);
                        return response
                    },
                    exposer
                )
            });
            // NOT WORK GLOBALY 
            //const prisma = new prismaClient();
            // https://www.prisma.io/docs/concepts/components/prisma-client/custom-models
            // const myPrisma = prisma.$extends({ model: { [model]: { [method]: newMethod[method] } } })
            // console.log(prisma.user.getUser({ prisma }))
        }
    }
}

function use(method) {
    for (const prop in method) {
        if (['model', 'accepts', 'returns', 'http', 'allow'].includes(prop)) continue

        if (method['allow']) {
            for (const role of method['allow'])
                addAcls([method['model'], prop, role])
        }

        list[method.model] = Object.assign({}, list[method.model], { [prop]: method })
    }
    return list
};


export { customRoutes, use, list, exposer };
