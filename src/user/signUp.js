export default {
    model: 'user',
    accepts: {
        type: "object",
        properties: {
            name: { type: "string" },
            password: { type: "string" },
        },
        required: ["name", "password"],
    },
    returns: {
        type: "object"
    },
    allow: '$',
    http: {
        path: `/signUp`,
        verb: 'POST'
    },
}