import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable, catchError, map } from 'rxjs';
import { Request, Response } from 'express';

@Injectable()
export class ResponseFormatInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    console.log("Before route handler hits...");

    return next.handle().pipe(
      map((originalData) => {
        const data = originalData ? {...originalData} : originalData;

        
        if (data?.cookies) {
          console.log('Setting cookies:', data.cookies);
          for (const cookie of data.cookies) {
            response.cookie(
              cookie.name,
              cookie.value,
              cookie.options || {}
            );
          }
        }

        if (data?.clearCookies) {
          console.log('Clearing cookies:', data.clearCookies);
          for (const cookieName of data.clearCookies) {
            response.clearCookie(cookieName);
          }
        }


        let responseData;
        let message = 'Request successful';
        
        if (data?.cookies || data?.clearCookies) {
          const { cookies, clearCookies, msg, ...rest } = data;
          responseData = rest;
          message = msg || message;
        } else {
          responseData = data;
        }

        const formattedResponse = {
          statusCode: response.statusCode || HttpStatus.OK,
          success: true,
          message,
          data: responseData,
        };

        console.log('Formatted response:', formattedResponse);
        return formattedResponse;
      }),
      catchError((err) => {
        console.error('Interceptor error:', err);
        const statusCode = err?.status || HttpStatus.INTERNAL_SERVER_ERROR;
        const message = err?.message || 'Internal Server Error';

        throw new HttpException(
          {
            statusCode,
            success: false,
            message,
            error: err?.response || err,
          },
          statusCode,
        );
      })
    );
  }
}