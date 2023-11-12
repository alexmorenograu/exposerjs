import { use } from '../customRoutes.js';
import UNAUTHORIZED from '../errors/unauthorized.js';

// const roleList = new Set(['developer', 'basic']); // get from db
const aclList = new Map();

function aclCheck(model, name, role) {
    // console.log(aclList)
    role = '*' //REMOVE TODO:
    const aclModel = aclList.get(model);
    if (!aclModel) throw UNAUTHORIZED;

    const method = aclModel.get(name);
    if (!method) throw UNAUTHORIZED;
    if (method.has('$')) return

    if (!role) throw UNAUTHORIZED
    if (method.has('*')) return
    if (!method.has(role)) throw UNAUTHORIZED;
}

function addAcls(acls) {
    if (typeof acls !== 'object') return; //throw

    if (!Array.isArray(acls)) { //is object
        // if (acls.role == '*') {
        //     for (const role of Array.from(roleList)) {
        //         addAcls({ model: acls.model, name: acls.name, role })
        //     }
        //     return
        // }

        const model = aclList.get(acls.model) || new Map();
        const method = model.get(acls.name) || new Set();

        method.add(acls.role);
        model.set(acls.name, method);
        aclList.set(acls.model, model);
        return
    }

    if (typeof acls[0] !== 'object') //is array
        return addAcls({ model: acls[0], name: acls[1], role: acls[2] })

    for (const acl of acls)
        addAcls(acl)
}

function addModel(model, acls) {
    for (const acl of acls) {
        if (typeof acl[1] == 'string') acl[1] = [acl[1]]
        for (const role of acl[1])
            addAcls({ model, name: acl[0], role })
    }
}

export { addAcls, addModel, aclCheck };

