import { HttpException, HttpStatus } from '@nestjs/common';

export class PendingVerificationException extends HttpException {
  constructor() {
    super(
      {
        statusCode: HttpStatus.FORBIDDEN,
        error: 'PendingVerificationException',
        message: 'Your account has been blocked. Contact support.',
      },
      HttpStatus.FORBIDDEN,
    );
  }
}
