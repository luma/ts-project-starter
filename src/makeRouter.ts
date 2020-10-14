import {Http2ServerRequest, Http2ServerResponse} from 'http2';

import Router, {HTTPVersion} from 'find-my-way';

export type DefaultRoute = (req: Http2ServerRequest, res: Http2ServerResponse) => void;
export type OnBadUrlRoute = (path: string, req: Http2ServerRequest, res: Http2ServerResponse) => void;

/**
 * The default default route :-)
 */
const defaultDefaultRoute = (req: Http2ServerRequest, res: Http2ServerResponse): void => {
  res.statusCode = 404
  res.end()
};

/**
 * The default onBadUrl route
 */
const defaultOnBadUrlRoute = (path: string, req: Http2ServerRequest, res: Http2ServerResponse): void => {
  res.statusCode = 400
  res.end(`Bad path: ${path}`)
};

interface RouterOptions {
  defaultRoute?: DefaultRoute;
  onBadUrl: OnBadUrlRoute;
}

const defaultOptions = Object.freeze({
  defaultRoute: defaultDefaultRoute,
  onBadUrl: defaultOnBadUrlRoute,
});

/**
 * Constructs the default router which sets some default behaviour, which
 * can be overidden by supplying different options.
 */
export default function makeRouter(
  options: Partial<RouterOptions> = {},
): Router.Instance<HTTPVersion.V2> {
  const {
    defaultRoute,
    onBadUrl,
  } = Object.assign({}, defaultOptions, options);

  return Router<HTTPVersion.V2>({
    defaultRoute,
    onBadUrl,
  });
}
