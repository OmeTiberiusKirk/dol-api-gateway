import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SubDistrictsService } from './sub-districts.service';

@ApiTags('Sub-Districts')
@Controller('sub-districts')
export class SubDistrictsController {
  constructor(private readonly subDistrictsService: SubDistrictsService) {}

  @ApiOperation({
    summary: 'Get sub-districts response',
    description:
      'Forwards the request to the Auth Service (dol-auth-service) via TCP transport and returns the result.',
  })
  @ApiResponse({
    status: 200,
    description: 'Sub-districts response',
    schema: {
      type: 'string',
      example: 'Successfully fetched sub-districts data',
    },
  })
  @ApiResponse({ status: 503, description: 'Auth Service unavailable' })
  @ApiResponse({ status: 504, description: 'Auth Service timed out' })
  @Get()
  async getSubDistricts(): Promise<string> {
    return this.subDistrictsService.getSubDistricts();
  }
}
