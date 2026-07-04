import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MasterController } from './master.controller';
import { MasterService } from './master.service';

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
  providers: [MasterService],
  controllers: [MasterController],
})
export class MasterModule {}
