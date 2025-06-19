import { getAcls } from '../../acl/dbImport.js';
import { aclCheck } from '../../acl/aclVerification.js';
import parametizer from '../../util/parametizer.js';

import INTERNAL_ERROR from "../../errors/internalError.js";

export default async (req, res, model, method, schema, fn, exposer) => {
    try {
        const accessUser = req?.accessUser;
        if (global.CONFIG.aclType == 'db') await getAcls({ exposer });

        aclCheck(model, method, accessUser?.role);
        const params = parametizer(req, schema, !exposer);
        const response = await fn(params, accessUser)

        return res.send(response)
    } catch (e) {
        // console.log(e)
        if (e.statusCode)
            return res.status(e.statusCode).send(e);
        return res.status(500).send(INTERNAL_ERROR);
    }
}