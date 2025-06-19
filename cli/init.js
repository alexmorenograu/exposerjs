// cli/init.js
import { execSync } from 'child_process';
import { mkdir, writeFile } from 'fs/promises';
import { existsSync } from 'fs';
import inquirer from 'inquirer';
import { createRequire } from 'module';
import https from 'https';

const require = createRequire(import.meta.url);

// 1. Get current version
const localVersion = require('../package.json').version;

// 2. Get latest version from npm
function fetchLatestVersion(pkg) {
    return new Promise((resolve, reject) => {
        https.get(`https://registry.npmjs.org/${pkg}/latest`, (res) => {
            let data = '';
            res.on('data', (chunk) => (data += chunk));
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    console.log('parsed: ', parsed);
                    resolve(parsed.version);
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', reject);
    });
}

// 3. Install NPM package
function installPackage(pkg) {
    console.log(`Installing ${pkg}...`);
    execSync(`npm install ${pkg}`, { stdio: 'inherit' });
}

// 4. Create a folder (recursively)
async function createFolder(path) {
    if (!existsSync(path)) {
        await mkdir(path, { recursive: true });
    }
}

// 5. Create a file with content
async function createFile(path, content = '') {
    await writeFile(path, content);
}

export default async function init() {
    console.log('🚀 Initializing ExposerJS project...');

    try {
        const latestVersion = await fetchLatestVersion('exposerjs');

        if (latestVersion !== localVersion) {
            const { upgrade } = await inquirer.prompt([
                {
                    type: 'confirm',
                    name: 'upgrade',
                    message: `A new version of exposerjs is available (${latestVersion}). Update?`,
                    default: true,
                },
            ]);
            if (upgrade) installPackage('exposerjs@latest');
        }

        const { adapter } = await inquirer.prompt([
            {
                type: 'list',
                name: 'adapter',
                message: 'Which router adapter do you want to use?',
                choices: ['express', 'hono', 'elysia'],
            },
        ]);

        // const adapterPackage = `@exposerjs/adapter-${adapter}`;
        // installPackage(adapterPackage);

        const { structure } = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'structure',
                message: `Do you want us to generate the base folders and files?`,
                default: true,
            },
        ]);

        // Create base structure
        if (structure) {
            await createFolder('src');
            await createFolder('src/routes');
            await createFolder('src/models');

            await createFile('server.js', `
                // Entry point for your ExposerJS app
                codigo base con su adaptador etc
            `);
        }
        // await createFile('src/routes/example.js', `// Example route`);
        // await createFile('src/models/user.js', `// Example model`);
        // await createFile('src/middleware/logger.js', `// Example middleware`);

        console.log(`🎉 ExposerJS project initialized with ${adapter} adapter!`);
    } catch (err) {
        console.error('❌ Failed to initialize:', err.message);
    }
}
