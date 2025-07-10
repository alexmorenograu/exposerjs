# Change Log

```
v0.2.7 🌐: Web: New site
v0.2.6 ✅: Feat: Support yml file config
v0.2.5 🛠️: Fix: Parametizer
v0.2.4 
    🛠️: Fix: Models handled errors
    📦: Refactor: Models and Methods use handler
v0.2.3 📦 Refactor: autoImport use readdir instead of opendir (fix node v18)
v0.2.2 🛠️ Fix: autoImport
v0.2.1 🛠️ Fix: autoImport
v0.2.0 autoImport && run params
    ✅: Feat: AutoImport config
    ↗️: Migrate: from 0.1.X to 0.2.0
        ⚠️: exposer.run(PrismaInstance, app || null, config) → exposer.run({PrismaInstance, app, config})

v0.1.0 prepare for multiple orm version
    ✅: Feat: Create exposerjs-orm-prisma
    ✅: Feat: Prisma decoupling from the core
    ✅: Feat: Use exposerjs-orm-prisma by default
    ✅: Feat: Config.aclType ['fast', 'fast&db', 'cache', 'db']
    ✅: Fix: Parametizer
    ↗️: Migrate: from 0.0.X to 0.1.0
        ⚠️: exposer.run(app, PrismaInstance) → exposer.run(PrismaInstance, app | null)

v0.0.10
    ✅: Feat: Express cease to be mandatory parameter

v0.0.9
    ✅: Fix: package.json dependencies

v0.0.8
    ✅: Fix: role bugs

v0.0.7
    ✅: Fix: readme for npm

v0.0.6
    ✅: Fix: readme for npm

v0.0.5
🛠️: ACLs Validation
    ✅: FastACL

v0.0.4
🛠️: Add test environment
    ✅: Start local mariadb
    ✅: Add structure and fixtures
    ✅: Route models

v0.0.3
✅: Token Validation
    ✅: tokenVerify()
    ✅: middleware tokenVerify()
    ✅: signIn()
    ✅: singUp()

v0.0.2
✅: Route customs
    ✅: Validator Accepts(AJV)
    ✅: Validator Return(AJV)
    ✅: Parametizer
✅: Route models
    ✅: Primary key param
    ✅: Parametizer

v0.0.1
✅: Start proyect
```

# Next versions

```
v0.X.X
🛠️: Support Hooks

v0.X.X
🛠️: Add test environment
    🛠️: Token Validation
    🛠️: ACL Validation
    🛠️: ACL Types

v0.X.X
🛠️: Support TypeORM

v0.X.X
🛠️: Support Sequelize

```
