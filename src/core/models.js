import pluralize from 'pluralize';
import handler from './handler.js';

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

                // Deploy route models

                await app[verb](path, async (req, res) => {
                    return await handler(req, res, model, method, schema,
                        async (params) => await orm.models[model][method](params))
                });
            }
        }
    }
}