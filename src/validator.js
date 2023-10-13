import Ajv from "ajv";
const ajv = new Ajv();

export default (toValidate, schema) => {
    if (!schema) return
    console.log(toValidate, schema)
    if (ajv.validate(schema, toValidate)) return
    throw {
        name: 'BAD_REQUEST',
        notifyMessage: 'Bad request',
        statusCode: 400,
        type: 'warning',
        icon: 'warning'
    }
}