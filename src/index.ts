
import Hapi from '@hapi/hapi';
import hapiPino from 'hapi-pino';

import getConfFromEnv from './config/getConfFromEnv';
import makeLog from './logging/makeLog';

export interface Options {
  host: string;
  port: number;
}

export default async function init({host, port}: Options): Promise<void> {
  // const log = makeLog();
  // const conf = getConfFromEnv(process.env);

  const server = Hapi.server({
    host,
    port,
  });

  await server.register({
    plugin: hapiPino,
    options: {
      // Redact Authorization headers, see https://getpino.io/#/docs/redaction
      redact: ['req.headers.authorization']
    }
  });


  server.route({
    method: 'get',
    path: '/',
    handler: async (req, res) => {
      return {
        message: 'Hello World',
      };
    },
  });

  await server.start();
};
