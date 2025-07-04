import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs';
import INTERNAL_ERROR from '../errors/internalError.js';
// import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { encode, decode } from "@msgpack/msgpack";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);
const directoryPath = 'exposerjs/cache'
const filePath = join(process.cwd(), directoryPath, 'rolesInheritance.bin');

function generateInheritance(roles, inheritances) {
    const inheritanceModel = {
        tableName: "roleInheritance",
        role: "role",
        inherit: "inherit"
    };

    const { role: roleName, inherit: inheritName } = inheritanceModel;

    const inheritanceMap = {};
    for (const { [roleName]: role, [inheritName]: inherit } of inheritances) {
        if (!inheritanceMap[role]) {
            inheritanceMap[role] = [];
        }
        inheritanceMap[role].push(inherit);
    }

    const rolesInheritance = {};

    for (const role of roles) {
        getInheritance(role, new Set());
    }

    function getInheritance(role, visited) {
        if (rolesInheritance[role]) return rolesInheritance[role];

        const loop = visited.has(role)
        visited.add(role);

        const result = new Set([role]);
        const inherits = inheritanceMap[role] || [];

        for (const inherit of inherits) {
            if (loop) {
                // console.warn(`Cycle detected involving role: ${role}`);
                continue
            }
            const inheritedRoles = getInheritance(inherit, visited);
            for (const inheritedRole of inheritedRoles) {
                result.add(inheritedRole);
            }
        }

        visited.delete(role);
        rolesInheritance[role] = Array.from(result);
        return rolesInheritance[role];
    }

    return rolesInheritance;
}


function saveInheritanceToBinaryFile(data) {
    const directory = dirname(directoryPath);
    if (!existsSync(directory)) {
        mkdirSync(directoryPath, { recursive: true });
        console.log('Directorios creados:', directory);
    }
    writeFileSync(filePath, encode(data));
}

function loadInheritanceFromBinaryFile(filePath) {
    if (existsSync(filePath))
        return decode(readFileSync(filePath));
    return null;
}

function getInheritances(roles, inheritances) {
    let rolesInheritance = loadInheritanceFromBinaryFile(filePath);
    if (!rolesInheritance) {
        if (!roles || !inheritances) throw INTERNAL_ERROR
        rolesInheritance = getAndSave(roles, inheritances)
    }
    return rolesInheritance
}

function getAndSave(roles, inheritances) {
    const rolesInheritance = generateInheritance(roles, inheritances);
    saveInheritanceToBinaryFile(rolesInheritance);
    return rolesInheritance
}

function roleCheck(role) {
    const inherits = getInheritances()
    return inherits[role]
}

export { roleCheck, getAndSave }