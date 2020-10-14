import {readFileSync} from 'fs';

import createAndListen from './http2/server';
import makeAppHandler from './app';
import applyLoggingToRequestHandler, { makeRequestIDGenerator } from './http2/applyLoggingToRequestHandler';
import makeLog from './logging/makeLog';
import makeRouter from './makeRouter';

export interface Options {
  keyPath: string;
  certPath: string;
  host: string;
  port: number;
}

function init({host, port, keyPath, certPath}: Options): void {
  const log = makeLog();

  const privateKey = readFileSync(keyPath).toString();
  const cert = readFileSync(certPath).toString();

  const router = makeRouter();

  router.on('GET', '/', (req, res, params) => {
    res.setHeader('content-type',  'application/json; charset=utf-8');
    res.end('{"message":"hello world"}')
  });

  const appHandler = makeAppHandler(router, log);
  const nextReqID = makeRequestIDGenerator();
  const requestHandler = applyLoggingToRequestHandler(log, nextReqID, appHandler);

  const serverOptions = {
    requestHandler,
    privateKey,
    cert,
    host,
    port,
    log,
  };

  createAndListen(serverOptions).then(({address}) => {
    log.info({address}, 'Server is listening');
  });
}

export default init;
