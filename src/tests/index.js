// // TEST:
import { tap } from 'node:test/reporters';
import { run } from 'node:test';
import process from 'node:process';
import path from 'node:path';

run({
    files: [
        path.resolve('./src/tests/core/modelRoutes.spec.js'),
        path.resolve('./src/tests/core/customRoutes.spec.js')
    ]
})
    .compose(tap)
    .pipe(process.stdout)