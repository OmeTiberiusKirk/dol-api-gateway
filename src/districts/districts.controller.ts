import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DistrictsService } from './districts.service';

@ApiTags('Districts')
@Controller('districts')
export class DistrictsController {
  constructor(private readonly districtsService: DistrictsService) {}

  @ApiOperation({
    summary: 'Get districts response',
    description:
      'Forwards the request to the Auth Service (dol-auth-service) via TCP transport and returns the result.',
  })
  @ApiResponse({
    status: 200,
    description: 'Districts response',
    schema: {
      type: 'string',
      example: 'Successfully fetched districts data',
    },
  })
  @ApiResponse({ status: 503, description: 'Auth Service unavailable' })
  @ApiResponse({ status: 504, description: 'Auth Service timed out' })
  @Get()
  async getDistricts(): Promise<string> {
    return this.districtsService.getDistricts();
  }
}
