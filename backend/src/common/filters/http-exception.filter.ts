import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    const message = typeof exceptionResponse === 'object' 
      ? (exceptionResponse as any).message 
      : exceptionResponse;
    
    const errors = typeof exceptionResponse === 'object' && (exceptionResponse as any).errors
      ? (exceptionResponse as any).errors
      : {};

    const errorResponse = {
      success: false,
      message: Array.isArray(message) ? message[0] : message,
      errors: Array.isArray(message) ? { message } : errors,
    };

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        `HTTP Status: ${status} Error: ${exception?.message || JSON.stringify(exception)}`,
        exception?.stack
      );
    } else {
      this.logger.warn(
        `HTTP Status: ${status} Error: ${JSON.stringify(errorResponse)}`,
      );
    }

    response.status(status).json(errorResponse);
  }
}
