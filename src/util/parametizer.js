export default (req, schema, isModel) => {
    let urlParams = getParams(req, schema)
    if (isModel) urlParams = { where: urlParams }

    let properties = {}
    if (!isModel) {
        properties = JSON.parse(JSON.stringify(schema?.properties ?? {}));
        for (let key in properties) {
            properties[key] = undefined;
        }
    }

    const params = Object.assign(properties,
        req?.query?.params && JSON.parse(req.query.params),
        req.body ?? {},
        req.data ?? {},
        urlParams
    )

    if (params?.params && !Object.keys(params.params).length)
        delete params.params

    return params
}

function getParams(req, schema) {
    let urlParams = req.params;
    if (urlParams && schema) {
        for (let param in urlParams) {
            if (schema.properties[param].type === 'integer')
                urlParams[param] = Number(urlParams[param])
            if (schema.properties[param].type.includes('integer'))
                urlParams[param] = Number(urlParams[param])
        }
    }
    return urlParams
}