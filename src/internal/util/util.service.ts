import { Injectable, Logger } from '@nestjs/common';
import { getNamespace } from 'cls-hooked';

import { APP_NAMESPACE, TRACE_ID } from '../../common';

@Injectable()
export class UtilService {
  private logger: Logger;
  constructor() {
    this.logger = new Logger(UtilService.name);
  }

  getTraceId(): string {
    return getNamespace(APP_NAMESPACE).get(TRACE_ID);
  }
}
