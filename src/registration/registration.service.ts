import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { validate } from 'class-validator';
import {
  catchError,
  firstValueFrom,
  throwError,
  timeout,
  TimeoutError,
} from 'rxjs';
import { CreatePersonalDto } from 'src/common/dto/create-personal.dto';
import { CreateUserDto } from 'src/common/dto/create-user.dto';
import { CreateAddressDto } from 'src/common/dto/create-userAddress.dto';
import { ApiSuccessResponse } from 'src/common/interceptors/transform.interceptor';

@Injectable()
export class RegistrationService {
  constructor(@Inject('AUTH_SERVICE') private readonly client: ClientProxy) {}

  async register(data: CreateUserDto) {
    const personal = new CreatePersonalDto(data.personal);
    const address = new CreateAddressDto(data.address);
    const pErrors = await validate(personal);
    const aErrors = await validate(address);
    const errors = pErrors.concat(aErrors);

    if (errors.length > 0) {
      const message = errors.flatMap((error) =>
        Object.values(error.constraints ?? {}),
      );

      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message,
      });
    }

    return firstValueFrom(
      this.client.send<ApiSuccessResponse<unknown>>('REG001', data).pipe(
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
