import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RegistrationModule } from './registration/registration.module';
import { ProvincesModule } from './provinces/provinces.module';
import { DistrictsModule } from './districts/districts.module';

@Module({
  imports: [ProvincesModule, RegistrationModule, DistrictsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
