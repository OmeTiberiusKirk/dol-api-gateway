import {
  Controller,
  Post,
  Body,
  Inject,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { firstValueFrom, TimeoutError, throwError } from 'rxjs';
import { timeout, catchError } from 'rxjs/operators';

@ApiTags('Authentication')
@Controller('REG001')
export class RegistrationController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
  ) {}

  @ApiOperation({
    summary: 'Register a new user',
    description:
      'Forwards the registration payload to the Auth Service (dol-auth-service) via TCP transport and returns the result.',
  })
  @ApiResponse({
    status: 201,
    description: 'Registration successful',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'User registered successfully' },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Validation failed',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: {
          type: 'array',
          items: { type: 'string' },
          example: ['email must be an email'],
        },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  @ApiBody({
    schema: {
      type: 'object',
      description: 'Registration payload forwarded to the Auth Service',
      example: {
        personal: {
          title: 'ศาสตราจารย์',
          person_id: '1100702530622',
          given_name: 'นุกูล',
          family_name: 'เพิ่มสุทธิ',
          birth_date: new Date('1991-09-17'),
          date_of_expiry: new Date('2030-09-17'),
          email: 'jaruwanno1991@gmail.com',
          mobile_no: '0611436644',
          user_type_id: 1,
        },
        address: {
          address_type: 1,
          home_no: 17,
          soi: 'อ่อนนุช 29',
          road: 'สุขุมวิท 77',
          tambol_code: undefined,
          tambol_name: 'สวนหลวง',
          amphur_code: undefined,
          amphur_name: 'สวนหลวง',
          province_code: undefined,
          province_name: 'กรุงเทพฯ',
        },
      },
    },
  })
  @ApiResponse({ status: 503, description: 'Auth Service unavailable' })
  @ApiResponse({ status: 504, description: 'Auth Service timed out' })
  @ApiBearerAuth('JWT-auth')
  @Post()
  async register(@Body() body: unknown): Promise<{ message: string }> {
    const message = await firstValueFrom(
      this.authClient.send<string>('REG001', body).pipe(
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

    return { message };
  }
}
