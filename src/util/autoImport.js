import { opendir, stat, realpath } from 'node:fs/promises';

export default async (paths, getFile) => {
    if (paths) return console.log('CRITICAL ERROR: add `paths` in autoImport config')
    if (!getFile) getFile = (n) => n.includes('.js')
    if (!Array.isArray(paths)) paths = [paths]

    for (const path of paths)
        await checkAndimport(path, getFile)
}

async function checkAndimport(path, getFile) {
    try {
        const dir = await opendir(path);
        for await (const dirent of dir) {
            const newPath = dirent.path + '/' + dirent.name
            const stats = await stat(newPath)
            if (stats.isDirectory()) {
                // if is folder, recursive
                await checkAndimport(newPath, getFile)
                continue
            }

            if (getFile(dirent.name)) {
                // console.log('IMPORTING →', newPath)
                await import(await realpath(newPath))
            }
        }
    }
    catch (err) {
        console.log(err);
    }
}