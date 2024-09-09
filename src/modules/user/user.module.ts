import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserGateway } from 'src/gateways/user/user.gateway';
import { AuthGuard } from 'src/guards/auth.guard';
import { UserService } from 'src/services/user/user.service';

@Module({
  imports: [JwtModule.register({
    global: true,
    secret: process.env.JWT_SECRET
  })],
  providers: [UserService, UserGateway, AuthGuard],
  exports: [UserService],
})
export class UserModule { }
