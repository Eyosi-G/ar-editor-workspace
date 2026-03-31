// common/filters/http-exception.filter.ts

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let error = 'Error';
    console.log(JSON.stringify(exception));

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      error = exception.name;

      if (typeof res === 'string') {
        message = res;
      } else if (typeof res === 'object' && res !== null) {
        const r = res as any;
        message = r.message || message;
        error = r.error || error;
      }
    }

    const errorResponse: ErrorResponse = {
      statusCode: status,
      success: false,
      message,
      error,
      timestamp: new Date().toISOString(),
    };

    response.status(status).json(errorResponse);
  }
}

export interface ErrorResponse {
  statusCode: number;
  success: false;
  message: string | string[];
  error: string; // error type or name
  timestamp: string;
}
