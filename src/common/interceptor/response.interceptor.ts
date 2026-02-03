import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data: Record<string, unknown> | undefined) => {
        const message =
          typeof data?.message === 'string' ? data.message : 'Success';
        return {
          success: true,
          message,
          data: data?.data !== undefined ? data.data : data,
        };
      }),
    );
  }
}
