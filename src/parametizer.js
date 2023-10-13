export default (req, schema) => {
    const queryParams = req?.query?.params
    let urlParams = req.params;
    if (urlParams && schema) {
        for (param in urlParams) {
            if (schema.properties[param].type === 'integer')
                param = Number(param)
            if (schema.properties[param].type.includes('integer'))
                urlParams[param] = Number(param)
        }
    }
    return Object.assign({},
        queryParams ? JSON.parse(queryParams) : {},
        req.body ?? {},
        req.data ?? {},
        req.params ?? {}
    )
}