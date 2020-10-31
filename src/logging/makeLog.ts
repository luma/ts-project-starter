import makePino, {final as finalLog, Logger, stdSerializers} from 'pino';

export default function makeLog(): Logger {
  const log = makePino({
    serializers: {
      err: stdSerializers.err,
      req: stdSerializers.req,
      res: stdSerializers.res,
    }
  });

  // asynchronously flush every 10 seconds to keep the buffer empty
  // in periods of low activity
  //
  // Note: the unref() basically tells Node not to block shutdown
  //       of our process if the setInterval below is still scheduled
  //       to run.
  //
  // Node will usually wait for all queued timers to run before terminimating.
  // As we want to the timer below to keep running until we shutdown we're
  // politely telling Node to not wait for it and to just shut down when
  // it wants to.
  //
  setInterval(function () {
    log.flush()
  }, 10000).unref()

  // use pino.final to create a special logger that
  // guarantees final tick writes
  const handler = finalLog(log, (err: Error, finalLogger: Logger, evt: string) => {
    finalLogger.info(`${evt} caught`)

    if (err) {
      finalLogger.error(err, 'error caused exit')
      /* eslint-disable-next-line no-process-exit */
      process.exit(1);
      return;
    }

    /* eslint-disable-next-line no-process-exit */
    process.exit(0);
  });

  // catch all the ways node might exit
  process.on('beforeExit', () => handler(null, 'beforeExit'))
  process.on('exit', () => handler(null, 'exit'))
  process.on('uncaughtException', (err) => handler(err, 'uncaughtException'))
  process.on('SIGINT', () => handler(null, 'SIGINT'))
  process.on('SIGQUIT', () => handler(null, 'SIGQUIT'))
  process.on('SIGTERM', () => handler(null, 'SIGTERM'))

  return log;
}
