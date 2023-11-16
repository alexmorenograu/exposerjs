// // TEST:
import { tap } from 'node:test/reporters';
import { run } from 'node:test';
import process from 'node:process';
import path from 'node:path';
// import { exec } from 'child_process';

// import express, { json, urlencoded } from 'express';
// // import cors from 'cors';

// const app = express();
// const port = process.env.PORT || 3000;

// app.use(cors());
// app.use(json()); // support json encoded bodies
// app.use(urlencoded({ extended: true })); // support encoded bodies

// export { app };

// removeContainer(initContainer);
// function removeContainer(cb) {
//     exec('docker-compose --project-directory ./src/tests down', (error, stdout, stderr) => {
//         if (error) {
//             console.error(`${error}`.bgRed);
//             return;
//         }
//         if (typeof cb == 'function')
//             cb()
//     });
// }

// function initContainer() {
//     exec('docker-compose --project-directory ./src/tests up -d', async (error, stdout, stderr) => {
//         if (error) {
//             console.error(`${error}`.bgRed);
//             return;
//         }

//         const server = app.listen(port, () => {
//             console.log(`EXPOSER-TEST is ready ${port}`)
//         })


//         removeContainer(server.close)
//     });
// }


// app.listen(port, () => {
//     console.log(`EXPOSER-TEST is ready ${port}`)
// })
run({
    files: [
        path.resolve('./src/tests/modelRoutes.spec.js')
    ]
})
    .compose(tap)
    .pipe(process.stdout)