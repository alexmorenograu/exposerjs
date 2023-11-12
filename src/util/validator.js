import Ajv from "ajv";
const ajv = new Ajv();

export default (toValidate, schema, error) => {
    if (!schema) return
    // console.log(toValidate, schema)
    if (ajv.validate(schema, toValidate)) return
    console.log('EXPOSER: validation_error', toValidate, schema)
    throw error
}