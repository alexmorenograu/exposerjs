import signIn from './signIn.js';
import signUp from './signUp.js';
import { use } from '../customRoutes.js';

export default () => {
    const methods = { signUp, signIn, tokenVerify: { model: 'user' } };
    for (const method in methods)
        use(Object.assign(methods[method], { [method]: global.ORM.user[method] }))
}