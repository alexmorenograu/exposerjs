import { describe, it, before, mock } from "node:test";
import assert from 'node:assert/strict';
import modelsRoutes from "../modelRoutes.js";
import { PrismaClient } from '@prisma/client';
import config from '../../config.js';
// import { app } from "./server.js";

describe('modelsRoutes', async () => {
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

    it('Should be as many calls as there are methods in the config', async () => {
        await modelsRoutes(app, PrismaClient)

        assert.equal(app.get.mock.calls.length, Object.values(config.verbs.get).length);
        assert.equal(app.get.mock.calls[0].arguments[0], '/api/users/:id');
        assert.equal(app.post.mock.calls.length, Object.values(config.verbs.post).length);
        assert.equal(app.put.mock.calls.length, Object.values(config.verbs.put).length);
        assert.equal(app.patch.mock.calls.length, Object.values(config.verbs.patch).length);
        assert.equal(app.delete.mock.calls.length, Object.values(config.verbs.delete).length);
    });
})