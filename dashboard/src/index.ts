import { Elysia } from "elysia";
import { mainVar, requestObject, resultObject } from "./misc/type";
import { ip } from "elysia-ip";
import { database } from "./db/mongodb";
import { isDBSetup } from "./db/setup_db";
import { Routers } from "./api/Routers";
import { logger } from "toolbx";
import { Gateway } from "./api/Gateway";

const args = require('minimist')(Bun.argv.slice(2));
export let main: mainVar = {
  version: "skyline@1.0.0-OSS",
  listen: args.l || args.listen || '127.0.0.1',
  port: args.p || args.port || 8080,
  db: args.d || args.database || 'mongodb://localhost:27017',
  cachedb: args.c || args.cachedb || 'redis://127.0.0.1:6379'
};

// Connect to the database
export let resetDB = args.resetDB || false;
export let hasDebug = args.v || args.verbose || false;
export const db = await database(main.db);
export const date = new Date

// database setup
await isDBSetup(resetDB)

const app = new Elysia()
  .use(ip())
  .get('/', () => `TransDataAPIserver VER ${main.version}`) // Send back server banner
// Load routers
Routers.forEach((obj) => {
  app.all(obj.path, async (contents: requestObject) => {
    try {
      const date = new Date();
      if (hasDebug) logger(`audit> ${date} => ${JSON.stringify(contents)}`, 4);
      switch (obj.authType) {
        case 'token':
          return await Gateway(contents, obj.isAdmin, (contents, userObject) => obj.handler(contents, userObject))
        case 'none':
        default:
          return await obj.handler(contents)
      }
    } catch (error) {
      let errMsg = String(error);
      if (error instanceof Error) {
        errMsg = error.message;
      }
      const result: resultObject = {
        succeed: false,
        msg: errMsg,
        data: undefined
      }
      return JSON.stringify(result)
    }
  }, obj.schema)
})

app.listen({
  hostname: main.listen,
  port: main.port
});
