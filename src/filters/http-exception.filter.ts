import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Response , Request } from 'express';

@Catch()
export class HttpExceptionsFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();   //tell nestjs that we are working on http protocols not sockets this is to tell nestjs that we will get req , res 
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    response.status(status).json({
      // statusCode:status,
      // timeStamp:new Date().toISOString(),
      // path:request.url,
      // message: exception.message
      statusCode:status,
      success: false,
      message:"Request Failed",
      error: exception?.message || exception,
    })

  
  
  }
}
