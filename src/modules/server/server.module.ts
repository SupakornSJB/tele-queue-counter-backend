import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServerGateway } from 'src/gateways/server/server.gateway';
import { ServerSchema, ServerTimeSchema } from 'src/schemas/server.schema';
import { ServerService } from 'src/services/server/server.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Server', schema: ServerSchema },
      { name: 'ServerTime', schema: ServerTimeSchema },
    ]),
  ],
  providers: [ServerService, ServerGateway],
  exports: [ServerService],
})
export class ServerModule {}
