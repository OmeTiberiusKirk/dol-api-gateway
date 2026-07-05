import { ApiProperty } from '@nestjs/swagger';
import { CreatePersonalDto } from './create-personal.dto';
import { CreateAddressDto } from './create-userAddress.dto';
import { IsNotEmpty, IsObject } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    type: CreatePersonalDto,
    required: true,
  })
  @IsNotEmpty()
  @IsObject()
  personal!: CreatePersonalDto;

  @ApiProperty({
    type: CreateAddressDto,
    required: true,
  })
  @IsNotEmpty()
  @IsObject()
  address!: CreateAddressDto;
}
