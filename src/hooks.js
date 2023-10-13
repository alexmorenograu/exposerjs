export default (prisma) => {
    return prisma.$extends({
        query: {
            $allModels: {
                $allOperations({ model, operation, args, query }) {
                    return prisma.$transaction(async (tx) => {
                        if (true)
                            console.log('CALL BEFORE TRIGGER');
                        console.log(operation)
                        const res = await tx[model][operation](args);
                        if (true)
                            console.log('CALL AFTER TRIGGER');
                        return res;
                    })
                    //return query(args)
                },
            }
        },
        model: customMethods,
    })
}

// const exposerHooks = {
//     beforeSelect: (ctx, tx,) => console.log('this is a HOOK for SELECT'),
//     afterSelect: (ctx, tx,) => console.log('this is a HOOK for SELECT'),
//     beforeInsert: (ctx, tx,) => console.log('this is a HOOK for INSERT'),
//     afterInsert: (ctx, tx,) => console.log('this is a HOOK for INSERT'),
//     beforeUpdate: (ctx, tx,) => console.log('this is a HOOK for UPDATE'),
//     afterUpdate: (ctx, tx,) => console.log('this is a HOOK for UPDATE'),
//     beforeDelete: (ctx, tx,) => console.log('this is a HOOK for DELETE'),
//     afterDelete: (ctx, tx,) => console.log('this is a HOOK for DELETE')
// }