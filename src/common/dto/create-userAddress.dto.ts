import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateAddressDto {
  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({
    default: 1,
  })
  address_type?: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ApiPropertyOptional({
    default: '17',
  })
  home_no?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @ApiPropertyOptional({
    default: 'อ่อนนุช 29',
  })
  soi?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @ApiPropertyOptional({
    default: 'สุขุมวิท 77',
  })
  road?: string;

  constructor(data: CreateAddressDto) {
    Object.assign(this, data);
  }
}
