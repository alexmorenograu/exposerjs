export default {
    prefix: '/api',
    verbs: {
        get: {
            findUnique: '/:id',
            findMany: '',
            findFirst: '/first',
            count: '/count',
            aggregate: '/aggregate',
            groupBy: '/groupBy',
        },
        post: {
            create: '',
        },
        put: {
            upsert: '',
        },
        patch: {
            update: '/:id',
            updateMany: '/update',
        },
        delete: {
            delete: '/:id',
            deleteMany: '',
        }
    },
    tokenVerify: true,
    tokenKey: 'EXPOSER_TOKEN_KEY',
}

// findUnique