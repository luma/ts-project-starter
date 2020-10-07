import { Http2ServerRequest, Http2ServerResponse } from "http2";
import { Logger } from "pino";
import { OnRequestHandler } from "./server";

type IDGenerator = () => number;

const maxReqID = Number.MAX_SAFE_INTEGER

export function makeRequestIDGenerator(): IDGenerator {
  let nextReqID = 0;

  return (): number => {
    nextReqID = (nextReqID + 1) % maxReqID;

    return nextReqID;
  };
}

/**
 * This wraps another request handler and provides logging behaviour 
 * for it.
 * 
 * It will log details of the request
 */
export default function applyLoggingToRequestHandler(
  parentLog: Logger, 
  nextReqID: IDGenerator,
  reqHandler: OnRequestHandler,
): OnRequestHandler {
  return (
    req: Http2ServerRequest, 
    res: Http2ServerResponse,
  ): void => {
    const reqId = nextReqID();
    const log = parentLog.child({ 
      reqId,
      req,
    });
    const startTime = Date.now();

    // Call the success and failure paths for a request so we can log
    // in both

    const onResFinished = (): void => {
      res.removeListener('error', onResFailed);

      const responseTime = Date.now() - startTime;

      if (res.statusCode >= 500) {
        const err = new Error('failed with status code ' + res.statusCode);

        log.error({
          responseTime,
          res,
          err,
        }, 'request errored');

        return;
      }

      log.info({
        responseTime,
        res,
      }, 'request');
    };

    const onResFailed = (err: Error): void => {
      res.removeListener('finish', onResFinished);

      const responseTime = Date.now() - startTime;    

      log.error({
        responseTime,
        res,
        err,
      }, 'request errored');
    };

    res.once('finish', onResFinished);
    res.once('error', onResFailed);

    // Call the actual request handler
    reqHandler(req, res);
  };
};
