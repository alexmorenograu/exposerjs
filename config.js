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
            createMany: '',
        },
        put: {
            upsert: '',
        },
        patch: {
            update: '/:id',
        },
        delete: {
            delete: '/:id',
            deleteMany: '',
        }
    }
}

// findUnique