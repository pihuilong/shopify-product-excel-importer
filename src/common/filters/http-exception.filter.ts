import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { is } from 'ramda';

import { UtilService } from '../../internal';
import { ERR_PREFIX, LOG_LEVEL } from '../constants';
import { MyHttpException } from '../exceptions';

/**
 * Catch HttpException and its descendants and log the error
 */
@Injectable()
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private logger: Logger = new Logger(HttpExceptionFilter.name);
  constructor(private readonly utilService: UtilService) {}
  async catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception.getStatus();
    this.logger.warn(`Catch ${exception.name}! Request path: ${request.url}`);

    let exceptionResponse: any = exception.getResponse();

    if (!is(MyHttpException, exception)) {
      exceptionResponse = {
        code: `${ERR_PREFIX}-0`,
        description: exceptionResponse.error,
        message: exceptionResponse.message || '',
      };
    }
    const responseJson = {
      errors: [exceptionResponse],
      traceId: this.utilService.getTraceId(),
    };

    const logLevel = status < 500 ? LOG_LEVEL.WARN : LOG_LEVEL.ERROR;
    this.logger[logLevel]({
      ...responseJson,
      path: request.url,
      query: request.query,
      body: request.body,
      stack: exception.stack.split('\n'),
    });

    response.status(status).json(responseJson);
  }
}
