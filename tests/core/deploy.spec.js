import { describe, it, before, after } from "node:test";
import assert from 'node:assert/strict';
import exposer from '../../index.js';
import { adapters } from '../adapters/index.js';
import { PrismaClient } from '@prisma/client';

describe('customeRoutes', async () => {
    for (const [name, adapter] of Object.entries(adapters)) {
        before(async () => {
            await exposer.init({ PrismaClient, adapter })
            const method = {
                model: 'testModel',
                accepts: {},
                returns: {},
                http: {
                    path: `/myMethod`,
                    verb: 'GET'
                },
                myMethod: () => { },
            };
            exposer.use(method);
            await exposer.deploy({}, null, null);
        });

        after(async () => {
            await exposer.stop();
        });

        describe(`${name}`, async () => {
            const baseURL = `http://localhost:3001`;

            it('Should deploy custom method', async () => {
                const res = await fetch(`${baseURL}/api/testModels/myMethod`);
                assert.equal(res.status, 401); // Asegura que la ruta existe
            });

            it('Should deploy default db methods', async () => {
                const list = ['user', 'acl', 'role', 'roleInherit'];
                for (const model of list) {
                    const res = await fetch(`${baseURL}/api/${model}s`);
                    assert.equal(res.status, 401, `${model} not deployed`);
                }
            });

            it('Should deploy login methods', async () => {
                const signIn = await fetch(`${baseURL}/api/users/signIn`);
                const signUp = await fetch(`${baseURL}/api/users/signUp`);
                assert.equal(signIn.status, 401, 'signIn not deployed');
                assert.equal(signUp.status, 401, 'signUp not deployed');
            });
        });
    }
});
