import { addAcls, setAclList } from './aclVerification.js';
import { cachedAcls } from './useAcl.js';

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
}

export { getAcls }