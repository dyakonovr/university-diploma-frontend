import type { BackendErrors } from '../types/core/backend-errors';
import type { ResponseMeta } from '../types/core/request.types';

export class RequestError extends Error {
  statusCode: number;
  errors: BackendErrors;
  meta: ResponseMeta;

  constructor(
    statusCode: number,
    message: string,
    errors: Record<string, string[]>,
    meta: ResponseMeta,
  ) {
    super(message);
    this.name = 'RequestError';
    this.errors = errors;
    this.statusCode = statusCode;
    this.meta = meta;
  }
}
