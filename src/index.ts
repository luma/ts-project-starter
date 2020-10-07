import {readFileSync} from 'fs';

import createAndListen from './server';
import makeAppHandler from './app';
import applyLoggingToRequestHandler, { makeRequestIDGenerator } from './applyLoggingToRequestHandler';
import makeLog from './makeLog';

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

  const appHandler = makeAppHandler(log);
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
