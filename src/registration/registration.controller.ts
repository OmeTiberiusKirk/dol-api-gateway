import { Controller, Post, Body } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { RegistrationService } from './registration.service';

@ApiTags('Authentication')
@Controller('REG001')
export class RegistrationController {
  constructor(private readonly registrationService: RegistrationService) {}

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
      examples: {
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
  async register(@Body() body: unknown) {
    return this.registrationService.register(body);
  }
}
