import 'colors';
import figlet from 'figlet';

///ExposerJS
import { use } from './src/core/deploy/methods.js';
import { init, deploy, stop } from './src/core/commands.js';

import UserError from './src/errors/userError.js';
import { addModel, addAcls } from './src/acl/aclVerification.js';

async function run({ PrismaClient, beforeMiddleware, afterMiddleware, adapter }) {
    const st = new Date();
    await init({ PrismaClient, adapter })

    console.log(figlet.textSync(`ExposerJS`, {
        font: 'Small Slant',
        horizontalLayout: 'universal  smushing',
        verticalLayout: 'universal  smushing',
    }));

    return await deploy({
        beforeMiddleware,
        afterMiddleware,
    }, st)
};

const exposer = { use, run, UserError, init, deploy, stop }
const acl = { addModel, addAcls }
export default exposer;
export { acl };