import { HttpException } from '@nestjs/common';
import { omit } from 'ramda';

import { ErrorMeta } from '../constants';

export class MyHttpException extends HttpException {
  constructor(error: ErrorMeta, message: string) {
    super({ ...omit(['status'], error), message }, error.status);
  }
}
