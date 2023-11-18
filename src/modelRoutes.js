import pluralize from 'pluralize';
import parametizerModel from './util/parametizerModel.js';
import { aclCheck } from './middleware/aclVerification.js';

export default async (app) => {
    const verbs = global.CONFIG.verbs;
    const orm = global.ORM;

    // PUSH MODELS FUNCTIONS
    for (let model in orm.runtimeModels) {
        for (let verb in verbs) {
            for (let method in verbs[verb]) {
                let path = `${global.CONFIG.prefix}/${pluralize(model)}${verbs[verb][method]}`
                let schema;
                if (path.includes(':id')) {
                    const primaryKeys = orm.runtimeModels[model].fields.filter(field => field.isId)
                    const pkNames = primaryKeys.map(ids => ids.name)
                    schema = orm.schematizer(primaryKeys);
                    path = path.replace(':id', `:${pkNames.join('/:')}`)
                }
                // console.log(prisma._runtimeDataModel.models[model])
                //TODO:
                // if (path.includes(':uniqueFields')) {
                //     const uniqueFields = prisma._runtimeDataModel.models[model].uniqueFields
                //     path.replace(':primaryKey', `:${primaryKeys.join('&')}`)
                // }


                // Deploy route models
                await app[verb](path, async (req, res) => {
                    aclCheck(model, method, req?.accessUser?.role);
                    const params = parametizerModel(req, schema);
                    res.send(await orm.models[model][method](params));
                });
            }
        }
    }
}