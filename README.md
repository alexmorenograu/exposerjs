# ExposerJS

ExposerJS is an API generator based on Express and Prisma. It deploys a route for each Prisma method.
It also allows you to add custom methods and deploy them in a simple way, providing everything you need.
It has the ability to use parameter validation (AJV), restriction checking (ACLs), and token validation (jsonwebtoken).

Required dependencies: [Express, Prisma]

## Installation

```bash
$ npm i exposerjs
```

## Usage

To start the API, you only need an instance of Express and Prisma:

```js
import { exposer } from "exposerjs";

//Express
import express from "express";
const app = express();
const port = process.env.PORT || 3000;

//Prisma
import { PrismaClient } from "@prisma/client";

//Import custom routes
import myCustomMethod from "../methods/myCustomMethod";

exposer.run(app, PrismaClient); //you can add a third parameter like user configs

app.listen(port, () => {
  console.log(`Backend is ready ${port}`);
});
```

### Default config

```js
export default {
  prefix: "/api",
  verbs: {
    get: {
      findUnique: "/:id",
      findMany: "",
      findFirst: "/first",
      count: "/count",
      aggregate: "/aggregate",
      groupBy: "/groupBy",
    },
    post: {
      create: "",
    },
    put: {
      upsert: "",
    },
    patch: {
      update: "/:id",
      updateMany: "/update",
    },
    delete: {
      delete: "/:id",
      deleteMany: "",
    },
  },
  tokenVerify: true,
  tokenKey: "EXPOSER_TOKEN_KEY",
  aclVerify: true,
  userModel: {
    roleId: "roleId",
    defaultRoleId: 1,
  },
  roleModel: {
    tableName: "role",
    id: "id",
    name: "name",
  },
};
```

### Adding Custom Routes

With the use of exposer.use({methodObject}), you can add custom routes.

```js
{
    Model*: is the Prisma model (table) to which the method will be added.
    Accepts: parameters to validate with AJV
    Return: expected response validated with AJV
    http: (Add only if you want to deploy the route) information to lift the route.
        path: route that will be added to the model (users/getUser)
        verb: type of request (GET, POST, PUT, PATCH, DELETE)
    [Method name]*: method name
}
```

(\*) required

```js
import { exposer } from "exposerjs";

exposer.use({
  model: "user",
  accepts: {
    type: "object",
    properties: {
      id: { type: "integer" },
      name: { type: "string" },
    },
    required: ["id"],
  },
  returns: {},
  http: {
    path: `/getUser`,
    verb: "GET",
  },
  getUser,
});

async function getUser(ctx, id, name) {
  const user = await ctx.exposer.user.findUnique({
    select: {
      id: true,
      name: true,
    },
    where: {
      id: ctx.params.id,
    },
  });
  console.log(id, "← id →", user.id);
  console.log(name, "← name →", user.name);
}
```

In front-end:
You can make the request (`/api/users/getUser`, {id, name})
Or
const params = encodeURIComponent(JSON.stringify({ id: 1, name: 'exposer' }))
You can make the request (`/api/users/getUser?params=${params}`)

In back-end
await ctx.exposer.user.getUser(ctx, id, name)

### ACLs

Exposer has 3 ways to use ACLs to adapt to the needs of each project.

```
-FastACL: reads the ACLs from code
-CacheACL: generates a JSON file from the exposerACL table. It also deploys the necessary methods to add/modify/delete the ACL and regenerate the JSON.
-DBACL: Reads the ACL from the exposerACL table. Table structure: model(Prisma model), aclType(type of acl. method or functionality), name(Prisma method, custom or \* for all), type(user or role), allow (username or role name)
```

Global 'allows':

```text
Use '*' for all roles
Use '$' for all (signIn, signUp, ...)
```

#### Add acls in code (FastACL):

```js
// In method: add property 'allow'
import { exposer } from "exposerjs";
exposer.use({
  model: "myModel",
  accepts: {},
  returns: {},
  http: {},
  allow: ['myRole'] // ← here
  myMethod,
});


//In model:
import { acl } from "exposerjs";
acl.addModel('myModel',
    [
        ['findMany', 'myRoleOne'],
        ['create', ['myRoleOne', 'myRoleTwo']]
        ['upsert', '*']
        ['myCustomMethod', '$']
    ],
);

```

## Exposer State:

✅:Implemented 🛠️:Work in progess ❌:Not Implemented yet

```
🛠️: Route models
    ✅: Primary key param
    ✅: Parametizer
    ❌: Unique Key param
    🛠️: ACLValidation
🛠️: Route customs
    ✅: Validator Accepts(AJV)
    ✅: Validator Return(AJV)
    ✅: Parametizer
    🛠️: ACLValidation
❌: Hooks
    ❌: Use or generate transaction

✅: Token Validation

🛠️: ACLs Validation
    ✅: FastACL
    ❌: CacheACL
    ❌: DBACL

```
