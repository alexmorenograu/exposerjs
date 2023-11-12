import pluralize from 'pluralize';
import parametizerModel from './util/parametizerModel.js';
import schematizer from './util/schematizer.js';
import { aclCheck } from './middleware/aclVerification.js';

export default async (app, prismaClient) => {
    const verbs = global.CONFIG.verbs;
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
                await app[verb](path, async (req, res) => {
                    aclCheck(model, method, req.accessUser.role);
                    const params = parametizerModel(req, schema);
                    // ACL validation
                    // console.log(JSON.parse(req?.query?.params || JSON.stringify({})),
                    //     req.body ?? {},
                    //     req.data ?? {},
                    //     req.params ?? {})
                    // console.log('PARAMETIZER', params)
                    res.send(await prisma[model][method](params));
                });
            }
        }
    }
}