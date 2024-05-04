import {
  SubscribeMessage,
  WebSocketGateway,
  MessageBody,
  ConnectedSocket,
  BaseWsExceptionFilter,
} from '@nestjs/websockets';
import { UseFilters } from '@nestjs/common';
import { CreateUserRequest, CreateUserResponse } from 'src/interfaces/user';
import { Socket } from 'socket.io';
import { UserService } from 'src/services/user/user.service';

@WebSocketGateway({ cors: true })
export class UserGateway {
  constructor(private userService: UserService) {}

  @UseFilters(new BaseWsExceptionFilter())
  @SubscribeMessage('user:auth')
  handleAuthentication(
    @MessageBody() body: CreateUserRequest,
    @ConnectedSocket() client: Socket,
  ): CreateUserResponse {
    return {
      id: this.userService.createUser(client.id, body),
    };
  }
}
