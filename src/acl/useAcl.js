import { getAclList } from './aclVerification.js';
import { getAcls } from './dbImport.js';
import { use, exposer } from '../core/deploy/methods.js';
let cachedAcls
//Get acls from db when it starts
export default async () => {
    cachedAcls = getAclList();
    if (['fast', 'db'].includes(global.CONFIG.aclType)) return
    await getAcls({ exposer }, global.CONFIG)
    if (global.CONFIG.aclType != 'cache') return

    const methods = { getAcls };
    for (const method in methods)
        use({ model: 'acl', [method]: method })
}

export { cachedAcls }