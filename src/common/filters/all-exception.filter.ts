import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { omit } from 'ramda';

import { UtilService } from '../../internal';
import { errorMap } from '../constants';

/**
 * Catch global exceptions and log the error
 */
@Catch()
@Injectable()
export class AllExceptionFilter implements ExceptionFilter {
  private logger: Logger = new Logger(AllExceptionFilter.name);
  constructor(private readonly utilService: UtilService) {}
  async catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    this.logger.error(`Unknown error! Request path: ${request.url}`);

    const exceptionResponse = {
      ...omit(['status'], errorMap.INTERNAL_SERVER_ERROR),
      message: exception.message,
    };
    const responseJson = {
      errors: [exceptionResponse],
      traceId: this.utilService.getTraceId(),
    };
    this.logger.error({
      ...responseJson,
      path: request.url,
      query: request.query,
      body: request.body,
      stack: exception.stack.split('\n'),
    });

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(responseJson);
  }
}
