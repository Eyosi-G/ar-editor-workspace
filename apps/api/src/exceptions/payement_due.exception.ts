import { HttpException, HttpStatus } from '@nestjs/common';

export class PaymentDueException extends HttpException {
  constructor() {
    super(
      {
        statusCode: HttpStatus.FORBIDDEN,
        error: 'PaymentDueException',
        message: 'Subscription expired. Please contact adminstrator.',
      },
      HttpStatus.FORBIDDEN,
    );
  }
}
