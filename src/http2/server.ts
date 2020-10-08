import {createSecureServer, Http2SecureServer, Http2ServerRequest, Http2ServerResponse} from 'http2';

type ServerAddress = {port: number, address: string};

export type OnRequestHandler = (
  req: Http2ServerRequest, 
  resp: Http2ServerResponse,
) => void;

export class HTTP2ServerUnknownError extends Error {}
export class HTTP2ServerAlreadyListening extends Error {}
export class HTTP2ServerOptionsMissing extends Error {}


export type CreateServerOptions = {
  privateKey?: string;
  cert?: string;
  connectionTimeout: number;
  sessionTimeout: number;
  requestHandler?: OnRequestHandler;
}

export type ListenServerOptions = {
  port: number;
  host: string;
}

export type ServerOptions = CreateServerOptions & ListenServerOptions;


/**
 * This one has a complex looking type but it breaks down to wanting DefaultOptions
 * to be ServerOptions, but with all defaultable options made Required and all non-defaultable
 * options optional.
 *
 * The only non-defaultable options are 'privateKey', 'cert', and 'requestHandler'.
 */

type DefaultOptions = NonNullable<Omit<ServerOptions, 'privateKey'|'cert'|'requestHandler'>>
  & Pick<ServerOptions, 'privateKey'|'cert'|'requestHandler'>;

const defaultOptions: Readonly<DefaultOptions> = Object.freeze({
  port: 0,
  host: 'localhost',
  connectionTimeout: 0,
  sessionTimeout: 5000,
});

/**
 * Return the HTTP2 server address if it's listening, otherwise it will return undefined
 */
const getServerAddress = (server: Http2SecureServer): ServerAddress | undefined => {
  const address = server.address();

  if (address === null) {
    // The server isn't connected yet or has been closed.
    return undefined;
  }

  if (typeof address === 'string') {
    // We're listening on a unix socket. We don't really handle this case properly right now as
    // we only listen host/port combos.
    return {address, port: 0}
  }

  return address;
}

/**
 * Create a new HTTP2 Server. This only constructs the HTTP2 Server, it does not attempt to listen.
 */
export function createServer(
  {
    privateKey: key,
    cert,
    requestHandler,
    sessionTimeout,
    connectionTimeout,
  }: Required<CreateServerOptions>,
): Http2SecureServer  {
  const server = createSecureServer(
    {key, cert},
    requestHandler,
  );

  server.on('session', (session) => {
    // Gracefully close sessions when they timeout
    //
    // https://nodejs.org/api/http2.html#http2_event_timeout
    // > After the http2session.setTimeout() method is used to set the timeout period for this Http2Session,
    // > the 'timeout' event is emitted if there is no activity on the Http2Session after the configured
    // > number of milliseconds. Its listener does not expect any arguments.
    session.setTimeout(sessionTimeout, session.close.bind(session));
  });

  server.setTimeout(connectionTimeout)

  return server;
};

/**
 * Listen on a HTTP2 Server. This returns a Promise that resolves when the server
 * is listening. It will reject the Promise if listening fails.
 *
 * This really only exists to wrap up all the various failure cases in a clean way
 * so the caller does not need to.
 */
export function listen(
  server: Http2SecureServer,
  {host, port}: ListenServerOptions,
): Promise<ServerAddress> {
  if (server.listening) {
    const address = server.address();

    if (address === null) {
      // We're listening without an address somehow...this should never happen
      return Promise.reject(
        new HTTP2ServerUnknownError('HTTP2 Server appears to be listening but has no address'),
      );
    }

    if (typeof address === 'string') {
      // We're listening on a unix socket...we don't handle this case well presently
      return Promise.reject(
        new HTTP2ServerAlreadyListening(`HTTP2 Server was already listening on unix socket '${address}'`),
      );
    }

    if (address.port !== port || address.address !== host) {
      // We're listening, but not on the port and/or address that we wanted
      const actual = `${address.address}:${address.port}`;

      return Promise.reject(
        new HTTP2ServerAlreadyListening(
          `HTTP2 Server was already listening on a different host/port. It is listening on ${actual} but you wanted ${host}:${port}`
        ),
      );
    }

    // We're listening on the Port and Host that we wanted, so this is fine.
    return Promise.resolve(address);
  }

  let listenErrorHandler: (err: Error) => void;

  const listenError = new Promise<ServerAddress>((resolve, reject) => {
    listenErrorHandler = (err: Error): void => {
      reject(err);
    };

    server.once('error', listenErrorHandler);
  });

  const listen = new Promise<ServerAddress>((resolve, reject) => {
    server.listen({port, host}, () => {
      server.removeListener('error', listenErrorHandler)

      const address = getServerAddress(server);

      if (address === undefined) {
        // We're somehow connected WITHOUT an address. This should never happen
        reject(new HTTP2ServerUnknownError('HTTP2 Server appears to be listening but has no address'));
        return;
      }

      resolve(address);
    });
  });

  return Promise.race([
    listenError,
    listen,
  ]);
};

export default async function createAndListen(
  opts: Partial<ServerOptions>,
): Promise<{server: Http2SecureServer, address: ServerAddress}> {
  const optsWithDefaults: DefaultOptions = Object.assign({}, defaultOptions, opts);

  if (optsWithDefaults.privateKey === undefined || optsWithDefaults.cert === undefined) {
    return Promise.reject(
      new HTTP2ServerOptionsMissing('Missing the privateKey or cert options, which are required for https'),
    );
  }

  if (optsWithDefaults.requestHandler === undefined) {
    return Promise.reject(
      new HTTP2ServerOptionsMissing('Missing the requestHandler option'),
    );
  }

  const server = createServer(optsWithDefaults as Required<CreateServerOptions>);

  const {host, port} = optsWithDefaults;
  const address = await listen(server, {host, port});

  return Promise.resolve({server, address});
};
