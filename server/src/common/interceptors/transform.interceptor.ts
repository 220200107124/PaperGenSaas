import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  success: boolean;
  message: string;
  data: T;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, any>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    
    let defaultMessage = 'Operation successful';
    if (method === 'POST') defaultMessage = 'Resource created successfully';
    if (method === 'DELETE') defaultMessage = 'Resource deleted successfully';
    if (method === 'PUT' || method === 'PATCH') defaultMessage = 'Resource updated successfully';

    return next.handle().pipe(
      map((data) => {
        // If data is already in expected format, return as is
        if (data && data.success !== undefined && data.message !== undefined) {
          return data;
        }

        const response: any = {
          success: true,
          message: data?.message || defaultMessage,
        };

        if (data?.pagination) {
          response.data = data.data;
          response.pagination = data.pagination;
        } else {
          response.data = data?.data !== undefined ? data.data : data;
        }

        return response;
      }),
    );
  }
}
