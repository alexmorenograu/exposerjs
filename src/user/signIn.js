export default {
    model: 'user',
    accepts: {
        type: "object",
        properties: {
            id: { type: ["integer", "null"] },
            name: { type: ["string", "null"] },
            password: { type: "string" },
        },
        required: ["password"],
    },
    returns: {
        type: "object"
    },
    allow: '$',
    http: {
        path: `/signIn`,
        verb: 'GET'
    }
};