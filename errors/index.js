/* eslint-disable max-classes-per-file */

import { constants } from 'http2';

export class AppError extends Error {}

export class HTTPError extends AppError {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'HTTPError';
  }
}

export class NotFoundError extends HTTPError {
  constructor(message) {
    super(message, constants.HTTP_STATUS_NOT_FOUND);
  }
}

export class BadRequestError extends HTTPError {
  constructor(message) {
    super(message, constants.HTTP_STATUS_BAD_REQUEST);
  }
}

export class UnauthorizedError extends HTTPError {
  constructor(message) {
    super(message, constants.HTTP_STATUS_UNAUTHORIZED);
  }
}
