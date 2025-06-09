#!/usr/bin/env node

import init from './init.js';

const command = process.argv[2];

if (command === 'init') {
    await init();
} else {
    console.log('Unknown command. Try: exposerjs init');
}
