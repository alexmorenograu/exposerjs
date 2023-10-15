import Ajv from "ajv";
const ajv = new Ajv();

export default (toValidate, schema, error) => {
    if (!schema) return
    if (ajv.validate(schema, toValidate)) return
    console.log('EXPOSER: validation_error')
    throw error
}