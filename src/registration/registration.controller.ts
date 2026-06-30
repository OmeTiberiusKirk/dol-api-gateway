import {
  Controller,
  Post,
  Body,
  Inject,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiBearerAuth,
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
  @ApiBody({
    schema: {
      type: 'object',
      description: 'Registration payload forwarded to the Auth Service',
      example: {
        username: 'john.doe',
        password: 'P@ssw0rd!',
        email: 'john.doe@example.com',
      },
    },
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
  @ApiResponse({ status: 503, description: 'Auth Service unavailable' })
  @ApiResponse({ status: 504, description: 'Auth Service timed out' })
  @ApiBearerAuth('JWT-auth')
  @Post()
  async register(@Body() body: unknown): Promise<{ message: string }> {
    console.log(body);
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
          return throwError(
            () =>
              new HttpException(
                'Auth service unavailable',
                HttpStatus.SERVICE_UNAVAILABLE,
              ),
          );
        }),
      ),
    );

    return { message };
  }
}
