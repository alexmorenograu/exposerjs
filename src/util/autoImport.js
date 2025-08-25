import { readdir, stat, realpath } from 'node:fs/promises';
import path from 'node:path';

export default async function autoImport(paths, getFile) {
    if (!paths)
        return console.error('CRITICAL ERROR: add `paths` in autoImport config');

    if (!getFile)
        getFile = (name) => name.endsWith('.js');


    if (!Array.isArray(paths))
        paths = [paths];

    await Promise.all(paths.map(p => processPath(p, getFile)));
}

async function processPath(currentPath, getFile) {
    try {
        const entries = await readdir(currentPath);

        const tasks = entries.map(async (entry) => {
            const fullPath = path.join(currentPath, entry);
            const stats = await stat(fullPath);

            if (stats.isDirectory()) {
                return processPath(fullPath, getFile);
            }

            if (getFile(entry)) {
                const resolved = await realpath(fullPath);
                return import(resolved);
            }
        });

        await Promise.all(tasks);
    } catch (err) {
        console.error(`Error processing ${currentPath}:`, err);
    }
}
