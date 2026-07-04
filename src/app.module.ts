import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RegistrationModule } from './registration/registration.module';
import { MasterModule } from './master/master.module';

@Module({
  imports: [MasterModule, RegistrationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
