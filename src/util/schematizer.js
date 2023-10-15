export default (primaryKeys) => {
    let schema = {
        type: "object",
        properties: {},
        required: [],
    };
    for (const primaryKey of primaryKeys) {
        schema.properties[primaryKey.name] = { type: prismaToAjvType(primaryKey.type) }
        schema.required.push(primaryKey.name)
    }

    return schema
}

function prismaToAjvType(type) {
    switch (type) {
        case 'Int':
            return 'integer'
        case 'Datetime':
            return 'timestamp'
        case 'Decimal':
            return 'float64'
        default:
            return type.toLowerCase()
    }
}