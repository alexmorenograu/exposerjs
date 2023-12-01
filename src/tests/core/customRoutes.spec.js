import { describe, it, before, mock } from "node:test";
import assert from 'node:assert/strict';
import { customRoutes, use } from "../../customRoutes.js";
import config from '../../../config.js';

describe('customRoutes', function () {
    describe('customRoutes()', async () => {
        const app = {
            get: () => { },
            post: () => { },
            put: () => { },
            patch: () => { },
            'delete': () => { }
        }
        before(() => {
            global.CONFIG = Object.assign(config);
            mock.method(app, 'get', () => { });
            mock.method(app, 'post', () => { });
            mock.method(app, 'put', () => { });
            mock.method(app, 'patch', () => { });
            mock.method(app, 'delete', () => { });
        });

        it('Should be as many calls as there are methods in the list', async () => {
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
            use(method);
            await customRoutes(app)

            assert.equal(app.get.mock.calls.length, 1);
        });
    })

    describe('use()', function () {
        it('should add properties to list object', function () {
            const method = {
                model: 'testModel',
                accepts: {},
                returns: {},
                http: {},
                method1: () => { },
                method2: () => { },
            };
            const listAfter = use(method);

            assert.deepEqual(Object.keys(listAfter['testModel']), ['myMethod', 'method1', 'method2']);
        });
    });
});
