import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
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
      typeof error === 'string'
        ? error
        : ((error as RpcErrorPayload)?.message ?? 'Validation failed');

    const badRequest = new BadRequestException(message);

    response.status(badRequest.getStatus()).json(badRequest.getResponse());
  }
}
