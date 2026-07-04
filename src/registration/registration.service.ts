import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import {
  catchError,
  firstValueFrom,
  throwError,
  timeout,
  TimeoutError,
} from 'rxjs';
import { ApiSuccessResponse } from 'src/common/interceptors/transform.interceptor';

@Injectable()
export class RegistrationService {
  constructor(@Inject('AUTH_SERVICE') private readonly client: ClientProxy) {}

  async register(body: unknown) {
    return firstValueFrom(
      this.client.send<ApiSuccessResponse<unknown>>('REG001', body).pipe(
        timeout(5_000),
        catchError((err: unknown) => {
          if (err instanceof TimeoutError) {
            return throwError(
              () =>
                new HttpException(
                  'Auth service timed out',
                  HttpStatus.GATEWAY_TIMEOUT,
                ),
            );
          }

          if (err instanceof Error) {
            return throwError(
              () =>
                new HttpException(
                  'Auth service unavailable',
                  HttpStatus.SERVICE_UNAVAILABLE,
                ),
            );
          }

          // Structured validation error forwarded from the Auth Service's
          // RpcException — rewrapped so RpcExceptionFilter can catch it.
          return throwError(() => new RpcException(err as object | string));
        }),
      ),
    );
  }
}
