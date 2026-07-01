import {
  Controller,
  Post,
  Body,
  Inject,
  HttpException,
  HttpStatus,
  BadRequestException,
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
import { CreateUserDto } from './dto/create-user.dto';
import { validate } from 'class-validator';

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
        personal: {
          title: 'ศาสตราจารย์',
          person_id: '1100702530622',
          given_name: 'นุกูล',
          family_name: 'เพิ่มสุทธิ',
          birth_date: new Date('1991-09-17'),
          date_of_expiry: new Date('2030-09-17'),
          email: 'nukool@40.co.th',
          mobile_no: '0611426633',
        },
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
  async register(
    @Body() body: { personal: CreateUserDto },
  ): Promise<{ message: string }> {
    const personal = new CreateUserDto(body.personal);

    const errors = await validate(personal);
    // errors is an array of validation errors
    if (errors.length > 0) {
      console.log('validation failed. errors: ', errors);
      throw new BadRequestException();
    } else {
      console.log('validation succeed');
    }

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
