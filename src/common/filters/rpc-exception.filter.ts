import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ConflictException,
  ExceptionFilter,
  ForbiddenException,
  HttpException,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Response } from 'express';

interface RpcErrorPayload {
  message?: string | string[];
}

@Catch(RpcException)
export class RpcExceptionFilter implements ExceptionFilter<RpcException> {
  catch(exception: RpcException, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();
    const error = exception.getError();
    const message =
      typeof error === 'object'
        ? ((error as RpcErrorPayload)?.message ?? 'An unknown error occurred.')
        : error;
    let request: HttpException;

    switch (error['statusCode']) {
      case 400:
        request = new BadRequestException(message);
        break;
      case 403:
        request = new ForbiddenException(message);
        break;
      case 409:
        request = new ConflictException(message);
        break;
      default:
        request = new HttpException(
          { message, error: 'Unknown error', statusCode: 520 },
          520,
        );
        break;
    }

    response.status(request.getStatus()).json(request.getResponse());
  }
}
