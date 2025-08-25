import express from '@exposerjs/adapter-express';
import hono from '@exposerjs/adapter-hono';
import fastify from '@exposerjs/adapter-fastify';
// import elysia from '@exposerjs/adapter-elysia';

export const adapters = {
    hono,
    hono2: hono,
    hono3: hono,
    fastify,
    fastify2: fastify,
    fastify3: fastify,
    express,
    express2: express,
    express3: express,
    // elysia,
};
