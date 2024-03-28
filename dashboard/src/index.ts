import { Elysia, t } from "elysia";
import { mainVar } from "./type";
import { getIP, IPHeaders } from "elysia-ip";
import { database } from "./mongodb";
import { isDBSetup } from "./setup_db";

const ip = (config: {
  checkHeaders?: IPHeaders[]
} = {}) => (app: Elysia) => {
  return app.derive(({ request }) => {
    if (globalThis.Bun) {
      if (!app.server) throw new Error(`Elysia server is not initialized. Make sure to call Elyisa.listen()`)
      return {
        ip: app.server.requestIP(request)
      }
    }
    // @ts-ignore
    const clientIP = getIP(request.headers, config.checkHeaders)
    return {
      ip: clientIP
    }
  })
}

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

// database setup
await isDBSetup(resetDB)

const app = new Elysia()
  .use(ip())
  .get('/', () => `TransDataAPIserver VER ${main.version}`) // Send back server banner
  .listen({
    hostname: main.listen,
    port: main.port
  });
