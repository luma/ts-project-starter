import { Http2ServerRequest, Http2ServerResponse, OutgoingHttpHeaders } from "http2";
import makePinoLogger, { destination } from 'pino';

import makeAppHandler, {AppRouter} from "../app";

type WrittenResponse = {
  statusCode: number;
  headers: OutgoingHttpHeaders
  data: (string | Uint8Array)[];
};

function makeMockRouter<Context>(): AppRouter<Context> {
  return {
    lookup(
      req: Http2ServerRequest,
      res: Http2ServerResponse,
    ): void {
      res.writeHead(200, {
        'content-type': 'text/html; charset=utf-8',
      });

      res.end('<h1>Hello World</h1>');
    },
  };
}

function makeMockRequest(resp: Partial<Http2ServerRequest> = {}): Http2ServerRequest {
  return {
    ...resp,
  } as unknown as Http2ServerRequest;
}

function makeMockResponse(): [Http2ServerResponse, WrittenResponse] {
  const written: WrittenResponse = {
    statusCode: 0,
    headers: {},
    data: [],
  };

  const resp: Http2ServerResponse = {
    writeHead(statusCode: number, headers?: OutgoingHttpHeaders): Http2ServerResponse {
      written.statusCode = statusCode;

      if (headers) {
        written.headers = headers;
      }

      return this as Http2ServerResponse;
    },

    end(data: string | Uint8Array, callback?: () => void): void {
      written.data.push(data);

      if (callback) {
        callback();
      }
    },
  } as unknown as Http2ServerResponse;

  return [resp, written];
}

test('should set the response status to 200', () => {
  const req = makeMockRequest();
  const [resp, respWritten] = makeMockResponse();

  const log = makePinoLogger(destination('/dev/null'));
  const router = makeMockRouter();
  const appHandler = makeAppHandler(router, log);
  appHandler(req, resp);

  expect(respWritten.statusCode).toBe(200);
})

test('should set the response content-type to text/html', () => {
  const req = makeMockRequest();
  const [resp, respWritten] = makeMockResponse();

  const log = makePinoLogger(destination('/dev/null'));
  const router = makeMockRouter();
  const appHandler = makeAppHandler(router, log);
  appHandler(req, resp);

  expect(respWritten.headers['content-type']).toBe('text/html; charset=utf-8');
})

test('should return the expected response body', () => {
  const req = makeMockRequest();
  const [resp, respWritten] = makeMockResponse();

  const log = makePinoLogger(destination('/dev/null'));
  const router = makeMockRouter();
  const appHandler = makeAppHandler(router, log);
  appHandler(req, resp);

  expect(respWritten.data).toStrictEqual(['<h1>Hello World</h1>']);
})
