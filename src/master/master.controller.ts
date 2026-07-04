import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { MasterService } from './master.service';

@ApiTags('Master')
@Controller('master')
export class MasterController {
  constructor(private readonly masterService: MasterService) {}

  @ApiOperation({
    summary: 'Get provinces response',
    description:
      'Forwards the request to the Auth Service (dol-auth-service) via TCP transport and returns the result.',
  })
  @Get('/provinces')
  async getProvinces() {
    return this.masterService.getProvinces();
  }

  @ApiOperation({
    summary: 'Get districts response',
    description:
      'Forwards the request to the Auth Service (dol-auth-service) via TCP transport and returns the result.',
  })
  @ApiQuery({
    name: 'provinceId',
    required: true,
    type: 'string',
    default: '10',
  })
  @Get('/districts/:provinceId')
  async getDistrictsByProvinceId(@Query('provinceId') id: string) {
    return this.masterService.getDistrictsByProvinceId(id);
  }

  @ApiOperation({
    summary: 'Get districts response',
    description:
      'Forwards the request to the Auth Service (dol-auth-service) via TCP transport and returns the result.',
  })
  @ApiQuery({
    name: 'districtId',
    required: true,
    type: 'string',
    default: '34',
  })
  @Get('/sub-districts/:districtId')
  async getSubDistrictsByDistrictId(@Query('districtId') id: string) {
    return this.masterService.getSubDistrictsByDistrictId(id);
  }
}
