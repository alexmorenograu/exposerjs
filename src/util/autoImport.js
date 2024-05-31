import { readdir, stat, realpath } from 'node:fs/promises';

export default async (paths, getFile) => {
    if (!paths) return console.log('CRITICAL ERROR: add `paths` in autoImport config')
    if (!getFile) getFile = (n) => n.includes('.js')
    if (!Array.isArray(paths)) paths = [paths]

    for (const path of paths)
        await checkAndimport(path, getFile)
}

async function checkAndimport(path, getFile) {
    try {
        const dir = await readdir(path);
        for (const dirent of dir) {
            const newPath = path + '/' + dirent
            const stats = await stat(newPath)
            if (stats.isDirectory()) {
                // if is folder, recursive
                await checkAndimport(newPath, getFile)
                continue
            }

            if (getFile(dirent)) {
                // console.log('IMPORTING →', newPath)
                await import(await realpath(newPath))
            }
        }
    }
    catch (err) {
        console.log(err);
    }
}