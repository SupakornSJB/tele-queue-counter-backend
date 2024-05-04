import { Module } from '@nestjs/common';
import { UserGateway } from 'src/gateways/user/user.gateway';
import { UserService } from 'src/services/user/user.service';

@Module({
  imports: [],
  providers: [UserService, UserGateway],
  exports: [UserService],
})
export class UserModule {}
