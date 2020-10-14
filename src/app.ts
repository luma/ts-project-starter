import {Http2ServerRequest, Http2ServerResponse} from 'http2';

import { Logger } from 'pino';

import { OnRequestHandler } from './http2/server';

/**
 * Why introduce a new type when we could just use the
 * `Router.Instance<HTTPVersion.V2>` type that is returned
 * by `makeRouter()`?
 *
 * The type is from the 'find-my-way` package and I want
 * to minimise how much our application layer is coupled
 * to external dependencies.
 *
 * A simpler reason is: why should it? The App handler
 * only needs a router with a "lookup" method, it doesn't
 * need everything else on `Router.Instance` so why should
 * it couple itself to it?
 *
 * Not doing so also makes testing easier, rather than
 * constructing something that includes everything in
 * `Router.Instance` we can create a simple mock
 * router like `{ lookup: (req, res): void => {...} }`
 */
export interface AppRouter<Context> {
  lookup<Context>(
    req: Http2ServerRequest,
    res: Http2ServerResponse,
    ctx?: Context
  ): void;
}

/**
 * Returns a new request handler that can be plugged into our HTTP2 Server.
 *
 * It accepts a router
 */
function makeAppHandler<Context>(
  router: AppRouter<Context>,
  log: Logger,
): OnRequestHandler {
  return (
    req: Http2ServerRequest,
    res: Http2ServerResponse,
  ): void => {
    router.lookup(req, res);
  };
}

export default makeAppHandler;
