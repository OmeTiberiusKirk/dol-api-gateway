import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsMobilePhone,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsNumberString()
  person_id!: string;

  @IsNotEmpty()
  @IsString()
  title!: string;

  @IsNotEmpty()
  @IsString()
  given_name!: string;

  @IsOptional()
  @IsString()
  middle_name?: string;

  @IsNotEmpty()
  @IsString()
  family_name!: string;

  @IsOptional()
  @IsString()
  title_en?: string;

  @IsOptional()
  @IsString()
  given_name_en?: string;

  @IsOptional()
  @IsString()
  middle_name_en?: string;

  @IsOptional()
  @IsString()
  family_name_en?: string;

  @IsDateString()
  birth_date!: Date;

  @IsDateString()
  date_of_expiry!: Date;

  @IsString()
  @IsOptional()
  ial_level?: string;

  @IsString()
  @IsOptional()
  legal_code?: string;

  @IsString()
  @IsOptional()
  legal_name?: string;

  @IsString()
  @IsOptional()
  land_office_id?: string;

  @IsString()
  @IsOptional()
  land_office_name?: string;

  @IsString()
  @IsOptional()
  land_office_position?: string;

  @IsString()
  @IsOptional()
  private_office_id?: string;

  @IsString()
  @IsOptional()
  private_office_name?: string;

  @IsEmail()
  email!: string;

  @IsBoolean()
  @IsOptional()
  is_email_verified?: boolean;

  @IsMobilePhone()
  mobile_no!: string;

  @IsDateString()
  @IsOptional()
  verfity_at?: Date;

  @IsBoolean()
  @IsOptional()
  is_verify?: boolean;
}
