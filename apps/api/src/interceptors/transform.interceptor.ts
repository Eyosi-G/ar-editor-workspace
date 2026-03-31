// interceptors/transform.interceptor.ts

import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
  } from '@nestjs/common';
  import { Observable } from 'rxjs';
  import { map } from 'rxjs/operators';
  
  @Injectable()
  export class TransformInterceptor<T>
    implements NestInterceptor<T, ResponseFormat<T>>
  {
    intercept(
      context: ExecutionContext,
      next: CallHandler,
    ): Observable<ResponseFormat<T>> {
      return next.handle().pipe(
        map((data) => ({
          statusCode: context.switchToHttp().getResponse().statusCode,
          success: true,
          data,
          timestamp: new Date().toISOString(),
        })),
      );
    }
  }
  
  interface ResponseFormat<T> {
    statusCode: number;
    success: boolean;
    data: T;
    timestamp: string;
  }
  