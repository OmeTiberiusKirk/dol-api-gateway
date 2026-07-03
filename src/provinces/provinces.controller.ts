import {
  Controller,
  Get,
  Inject,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { firstValueFrom, TimeoutError, throwError } from 'rxjs';
import { timeout, catchError } from 'rxjs/operators';

@ApiTags('Provinces')
@Controller('provinces')
export class ProvincesController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
  ) {}

  @ApiOperation({
    summary: 'Get provinces response',
    description:
      'Forwards the request to the Auth Service (dol-auth-service) via TCP transport and returns the result.',
  })
  @ApiResponse({
    status: 200,
    description: 'Provinces response',
    schema: {
      type: 'string',
      example: 'Hello from Provinces Service',
    },
  })
  @ApiResponse({ status: 503, description: 'Auth Service unavailable' })
  @ApiResponse({ status: 504, description: 'Auth Service timed out' })
  @Get()
  async getProvinces(): Promise<unknown> {
    return firstValueFrom(
      this.authClient.send('PROVINCES', {}).pipe(
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
