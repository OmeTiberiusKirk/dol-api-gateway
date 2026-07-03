import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom, TimeoutError, throwError } from 'rxjs';
import { timeout, catchError } from 'rxjs/operators';

@Injectable()
export class SubDistrictsService {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
  ) {}

  async getSubDistricts(): Promise<string> {
    return firstValueFrom(
      this.authClient.send<string>('SUB_DISTRICTS', {}).pipe(
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

          return throwError(() => new RpcException(err as object | string));
        }),
      ),
    );
  }
}
