import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { DistrictsController } from './districts.controller';
import { DistrictsService } from './districts.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.AUTH_SERVICE_HOST ?? 'localhost',
          port: parseInt(process.env.AUTH_SERVICE_PORT ?? '4001', 10),
        },
      },
    ]),
  ],
  controllers: [DistrictsController],
  providers: [DistrictsService],
})
export class DistrictsModule {}
