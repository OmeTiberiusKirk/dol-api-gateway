import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom, TimeoutError, throwError } from 'rxjs';
import { timeout, catchError } from 'rxjs/operators';

@Injectable()
export class MasterService {
  constructor(@Inject('AUTH_SERVICE') private readonly client: ClientProxy) {}

  async getProvinces() {
    return firstValueFrom(
      this.client.send<unknown>('PROVINCES', {}).pipe(
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

  async getDistrictsByProvinceId(provinceId: string) {
    return firstValueFrom(
      this.client.send<unknown>('DISTRICTS', provinceId).pipe(
        timeout(5_000),
        catchError((err: unknown) => {
          if (err instanceof TimeoutError) {
            return throwError(
              () =>
                new HttpException(
                  'service timed out',
                  HttpStatus.GATEWAY_TIMEOUT,
                ),
            );
          }

          if (err instanceof Error) {
            return throwError(
              () =>
                new HttpException(
                  'service unavailable',
                  HttpStatus.SERVICE_UNAVAILABLE,
                ),
            );
          }

          return throwError(() => new RpcException(err as object | string));
        }),
      ),
    );
  }

  async getSubDistrictsByDistrictId(districtId: string) {
    return firstValueFrom(
      this.client.send<unknown>('SUB_DISTRICTS', districtId).pipe(
        timeout(5_000),
        catchError((err: unknown) => {
          if (err instanceof TimeoutError) {
            return throwError(
              () =>
                new HttpException(
                  'service timed out',
                  HttpStatus.GATEWAY_TIMEOUT,
                ),
            );
          }

          if (err instanceof Error) {
            return throwError(
              () =>
                new HttpException(
                  'service unavailable',
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
