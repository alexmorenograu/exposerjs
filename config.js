export default {
    prefix: "/api",
    port: 3001,
    verbs: {
        get: {
            findUnique: "/:id",
            findMany: "",
            findFirst: "/first",
            count: "/count",
            aggregate: "/aggregate",
            groupBy: "/groupBy",
        },
        post: {
            create: "",
        },
        put: {
            upsert: "",
        },
        patch: {
            update: "/:id",
            updateMany: "/update",
        },
        delete: {
            delete: "/:id",
            deleteMany: "",
        },
    },
    tokenVerify: true,
    tokenKey: "EXPOSER_TOKEN_KEY",
    aclVerify: true,
    aclType: "fast",
    userModel: {
        roleId: "roleId",
        defaultRoleId: 1,
    },
    roleModel: {
        tableName: "role",
        id: "id",
        name: "name",
    },
    aclModel: {
        tableName: "acls",
        model: "model",
        name: "name",
        allow: "allow",
    },
};
