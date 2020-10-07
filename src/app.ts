import {Http2ServerRequest, Http2ServerResponse} from 'http2';
import { Logger } from 'pino';
import { OnRequestHandler } from './server';

function makeAppHandler(log: Logger): OnRequestHandler {
  return (
    request: Http2ServerRequest, 
    response: Http2ServerResponse,
  ): void => {
    response.writeHead(200, {
      'content-type': 'text/html; charset=utf-8',
    });
  
    response.end('<h1>Hello World</h1>');
  };  
} 

export default makeAppHandler;
