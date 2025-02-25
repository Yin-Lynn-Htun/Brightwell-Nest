import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { ResponseWrapper } from './response-wrapper.dto';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ResponseWrapper<T>> {
    return next.handle().pipe(
      map((data) => {
        if (data instanceof HttpException) {
          return {
            status: data.getStatus(),
            message: data.message,
            error: data.getResponse(),
          };
        }

        return {
          status: HttpStatus.OK,
          message: data?.responseMessage ?? 'Request successful',
          data: data,
        };
      }),
    );
  }
}
