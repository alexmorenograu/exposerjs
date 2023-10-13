import pluralize from 'pluralize';
import validator from './validator.js';
import parametizer from './parametizer.js';

export default (app, prismaClient, conf) => {
    const verbs = conf.verbs;
    const prisma = new prismaClient();


    // PUSH PRISMA MODELS FUNCTIONS
    for (let model in prisma._runtimeDataModel.models) {
        for (let verb in verbs) {
            for (let method in verbs[verb]) {
                let path = `/api/${pluralize(model)}${verbs[verb][method]}`
                if (path.includes(':id')) {
                    const primaryKeys = prisma._runtimeDataModel.models[model].fields.filter(field => field.isId).map(ids => ids.name)
                    path = path.replace(':id', `:${primaryKeys.join('/:')}`)
                }

                //TODO:
                // if (path.includes(':uniqueFields')) {
                //     const uniqueFields = prisma._runtimeDataModel.models[model].uniqueFields
                //     path.replace(':primaryKey', `:${primaryKeys.join('&')}`)
                // }


                // Deploy route models
                // console.log(path, verb, model, method)
                app[verb](path, async (req, res) => {
                    const params = parametizer(req);
                    // ACL validation
                    // AJV validation
                    // validator(params);
                    // Token validation
                    console.log(JSON.parse(req?.query?.params || JSON.stringify({})),
                        req.body ?? {},
                        req.data ?? {},
                        req.params ?? {})
                    res.send(await prisma[model][method](params));
                });
            }
        }
    }
}