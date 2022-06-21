import { ConsoleLogger, Injectable } from '@nestjs/common';

import { UtilService } from '../util';

@Injectable()
export class LoggerService extends ConsoleLogger {
  constructor(private readonly utilService: UtilService) {
    super();
  }
  log(message: any, context?: string) {
    const traceID = this.utilService.getTraceId();
    if (!context) {
      context = this.context;
    }
    if (context) {
      super.log(message, traceID ? `${traceID} ${context}` : `system ${context}`);
    } else {
      super.log(message, traceID ? `${traceID}` : `system`);
    }
  }
  error(message: any, trace?: string, context?: string) {
    const traceID = this.utilService.getTraceId();
    if (!context) {
      context = this.context;
    }
    if (context) {
      super.error(message, trace, traceID ? `${traceID} ${context}` : `system ${context}`);
    } else {
      super.error(message, trace, traceID ? `${traceID}` : `system`);
    }
    // NOTE: Can integrate webhooks so as to send notification to developers if needed
  }
  warn(message: any, context?: string) {
    const traceID = this.utilService.getTraceId();
    if (!context) {
      context = this.context;
    }
    if (context) {
      super.warn(message, traceID ? `${traceID} ${context}` : `system ${context}`);
    } else {
      super.warn(message, traceID ? `${traceID}` : `system`);
    }
  }
  debug(message: any, context?: string) {
    const traceID = this.utilService.getTraceId();
    if (!context) {
      context = this.context;
    }
    if (context) {
      super.debug(message, traceID ? `${traceID} ${context}` : `system ${context}`);
    } else {
      super.debug(message, traceID ? `${traceID}` : `system`);
    }
  }
  verbose(message: any, context?: string) {
    const traceID = this.utilService.getTraceId();
    if (!context) {
      context = this.context;
    }
    if (context) {
      super.verbose(message, traceID ? `${traceID} ${context}` : `system ${context}`);
    } else {
      super.verbose(message, traceID ? `${traceID}` : `system`);
    }
  }
}
