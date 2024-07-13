export default (req, schema, isModel) => {
    const queryParams = req?.query?.params && JSON.parse(req.query.params)
    let urlParams = getParams(req, schema)
    if (isModel) {
        urlParams.where = { ...queryParams?.where, ...urlParams }
    }

    let properties = {}
    if (!isModel) {
        properties = JSON.parse(JSON.stringify(schema?.properties ?? {}));
        for (let key in properties) {
            properties[key] = undefined;
        }
    }

    const params = Object.assign(properties,
        queryParams,
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
            const { type } = schema.properties[param]
            if (type.includes('integer'))
                urlParams[param] = Number(urlParams[param])
        }
    }
    return urlParams
}