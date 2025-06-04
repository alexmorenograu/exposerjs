import { join } from 'path';
import { readFileSync, existsSync } from 'fs';
import yaml from 'js-yaml';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default function setConfig(userConfig) {
    if (userConfig) console.warn('ExposerJS: userConfig is deprecated, use config.yml instead');
    const defaultConfig = yaml.load(readFileSync(join(__dirname, '../../config.yml')));
    let config = {};
    const filePath = getYamlPath()
    if (filePath)
        config = yaml.load(readFileSync(filePath))

    global.CONFIG = { ...defaultConfig, ...config, ...userConfig }
}

function getYamlPath() {
    let filePath = join(process.cwd(), 'exposerjs/config.yml');
    if (existsSync(filePath))
        return filePath

    filePath = join(process.cwd(), 'exposerjs/config.yaml');
    if (existsSync(filePath))
        return filePath
}


