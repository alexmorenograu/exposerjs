import { addAcls, setAclList } from './aclVerification.js';
import { cachedAcls } from './useAcl.js';
import { getAndSave } from './inheritance.js'

// const roles = ['developer', 'employee', 'customer', 'production', 'salesPerson', 'developerBoss'];
// const inheritances = [
//     { role: 'employee', inherit: 'customer' },
//     { role: 'production', inherit: 'employee' },
//     { role: 'salesPerson', inherit: 'employee' },
//     { role: 'developer', inherit: 'production' },
//     { role: 'developer', inherit: 'salesPerson' },
//     { role: 'developerBoss', inherit: 'developer' }
// ];
const roles = [
    'developer', 'employee', 'customer', 'production', 'salesPerson', 'developerBoss',
    'intern', 'manager', 'seniorDeveloper', 'qaEngineer', 'marketing', 'cto', 'hr', 'test'
];
const inheritances = generateRandomInheritances(roles, 100000)
// const inheritances = [
//     { role: 'employee', inherit: 'customer' },
//     { role: 'production', inherit: 'employee' },
//     { role: 'salesPerson', inherit: 'employee' },
//     { role: 'developer', inherit: 'production' },
//     { role: 'developer', inherit: 'salesPerson' },
//     { role: 'developerBoss', inherit: 'developer' },
//     { role: 'intern', inherit: 'employee' },
//     { role: 'manager', inherit: 'employee' },
//     { role: 'seniorDeveloper', inherit: 'developer' },
//     { role: 'qaEngineer', inherit: 'developer' },
//     { role: 'marketing', inherit: 'customer' },
//     { role: 'cto', inherit: 'developerBoss' },
//     { role: 'hr', inherit: 'manager' },
//     { role: 'manager', inherit: 'salesPerson' },
//     { role: 'seniorDeveloper', inherit: 'qaEngineer' },
// ];



async function getAcls(ctx) {
    setAclList(cachedAcls)
    const { aclModel, roleModel } = global.CONFIG
    const acls = await global.ORM.getAcls(ctx, global.CONFIG);
    for (const acl of acls) {
        addAcls({
            model: acl[aclModel.model],
            name: acl[aclModel.name],
            role: acl[roleModel.tableName][roleModel.name]
        })
    }
    getAndSave(
        roles,//global.ORM.getRoles(ctx, global.CONFIG),
        inheritances//global.ORM.getInheritances(ctx, global.CONFIG)
    )
}

// testing
function generateRandomInheritances(roles, numEntries) {
    const inheritances = [];

    for (let i = 0; i < numEntries; i++) {
        const role = roles[Math.floor(Math.random() * roles.length)];
        let inherit;
        do {
            inherit = roles[Math.floor(Math.random() * roles.length)];
        } while (inherit === role);

        inheritances.push({ role, inherit });
    }
    return inheritances;
}


export { getAcls }