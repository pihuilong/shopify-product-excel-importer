/**
 * TraceId middleware.
 * Details refer to: https://itnext.io/nodejs-logging-made-right-117a19e8b4ce
 */
import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { createNamespace } from 'cls-hooked';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

import { APP_NAMESPACE, TRACE_ID } from '../constants';

const clsNamespace = createNamespace(APP_NAMESPACE);

@Injectable()
export class TraceIdMiddleware implements NestMiddleware {
  use(request: Request, response: Response, next) {
    clsNamespace.bindEmitter(request);
    clsNamespace.bindEmitter(response);

    // NOTE: Generate a unique traceId for each request.
    const traceID = uuidv4();
    clsNamespace.runAndReturn(() => {
      clsNamespace.set(TRACE_ID, traceID);
      Logger.log(traceID, 'trace-id.middleware');
      return next();
    });
  }
}
