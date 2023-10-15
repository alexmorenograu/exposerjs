import pluralize from 'pluralize';
import validator from './util/validator.js';
import parametizerModel from './util/parametizerModel.js';
import schematizer from './util/schematizer.js';

export default (app, prismaClient, conf) => {
    const verbs = conf.verbs;
    const prisma = new prismaClient();


    // PUSH PRISMA MODELS FUNCTIONS
    for (let model in prisma._runtimeDataModel.models) {
        for (let verb in verbs) {
            for (let method in verbs[verb]) {
                let path = `/api/${pluralize(model)}${verbs[verb][method]}`
                let schema;
                if (path.includes(':id')) {
                    const primaryKeys = prisma._runtimeDataModel.models[model].fields.filter(field => field.isId)
                    const pkNames = primaryKeys.map(ids => ids.name)
                    schema = schematizer(primaryKeys);
                    path = path.replace(':id', `:${pkNames.join('/:')}`)
                }
                // console.log(prisma._runtimeDataModel.models[model])
                //TODO:
                // if (path.includes(':uniqueFields')) {
                //     const uniqueFields = prisma._runtimeDataModel.models[model].uniqueFields
                //     path.replace(':primaryKey', `:${primaryKeys.join('&')}`)
                // }


                // Deploy route models
                // console.log(path, verb, model, method)
                app[verb](path, async (req, res) => {
                    const params = parametizerModel(req, schema);
                    // ACL validation
                    // Token validation
                    console.log(JSON.parse(req?.query?.params || JSON.stringify({})),
                        req.body ?? {},
                        req.data ?? {},
                        req.params ?? {})
                    console.log('PARAMETIZER', params)
                    res.send(await prisma[model][method](params));
                });
            }
        }
    }
}