export default (req, schema) => {
    let urlParams = req.params;
    if (urlParams && schema) {
        for (let param in urlParams) {
            if (schema.properties[param].type === 'integer')
                urlParams[param] = Number(urlParams[param])
            if (schema.properties[param].type.includes('integer'))
                urlParams[param] = Number(urlParams[param])
        }
        urlParams = { where: urlParams }
    }

    const params = Object.assign({},
        req?.query?.params && JSON.parse(req.query.params),
        req.body ?? {},
        req.data ?? {},
        urlParams
    )

    if (params?.params && !Object.keys(params.params).length)
        delete params.params

    return params
}