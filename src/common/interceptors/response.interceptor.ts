import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
  RequestTimeoutException,
} from '@nestjs/common';
import { Observable, TimeoutError, throwError } from 'rxjs';
import { catchError, map, tap, timeout } from 'rxjs/operators';

import { UtilService } from '../../internal';
import { MAX_REQ_TIME } from '../constants';

/**
 * Interceptor for handling response.
 */
@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  private logger: Logger = new Logger(ResponseInterceptor.name);
  constructor(private readonly utilService: UtilService) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    const reqStartTime: number = Date.now();
    this.logger.log(`Enter response interceptor at: ${new Date(reqStartTime).toISOString()}`);
    this.logger.debug(`request.path: ${request.path}`);
    this.logger.debug(`request.body: ${JSON.stringify(request.body)}`);
    this.logger.debug(`request.query: ${JSON.stringify(request.query)}`);
    this.logger.debug(`request.params: ${JSON.stringify(request.params)}`);

    return next
      .handle()
      .pipe(tap(() => this.logger.log(`Request takes: ${Date.now() - reqStartTime}ms`)))
      .pipe(
        map(data => {
          // NOTE: Construct response body
          return {
            data,
            code: 0,
            message: 'OK',
            traceId: this.utilService.getTraceId(),
          };
        }),
      )
      .pipe(
        timeout(MAX_REQ_TIME),
        catchError(error => {
          if (error instanceof TimeoutError) {
            return throwError(new RequestTimeoutException());
          }
          return throwError(error);
        }),
      );
  }
}
