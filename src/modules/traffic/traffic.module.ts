import { Module } from '@nestjs/common';
import { TrafficGateway } from 'src/gateways/traffic/traffic.gateway';
import { TrafficService } from 'src/services/traffic/traffic.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TrafficSchema } from 'src/schemas/traffic.schema';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Traffic', schema: TrafficSchema }]),
    UserModule,
  ],
  providers: [TrafficService, TrafficGateway],
  exports: [TrafficService],
})
export class TrafficModule {}
