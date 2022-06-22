import { HttpStatus } from '@nestjs/common';

export const ERR_PREFIX = 'TEST';

export type ErrorMeta = {
  code: string;
  status: number;
  description: string;
};

enum ErrorKey {
  INTERNAL_SERVER_ERROR,
  INVALID_PARAMETER,
  RESOURCE_NOT_FOUND,
}

export const errorMap: Record<keyof typeof ErrorKey, ErrorMeta> = {
  // NOTE: Define business errors here
  INTERNAL_SERVER_ERROR: {
    code: `${ERR_PREFIX}-1`,
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  },
  INVALID_PARAMETER: {
    code: `${ERR_PREFIX}-2`,
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid parameter',
  },
  RESOURCE_NOT_FOUND: {
    code: `${ERR_PREFIX}-3`,
    status: HttpStatus.NOT_FOUND,
    description: 'Resource not found',
  },
};
