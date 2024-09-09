import {
  SubscribeMessage,
  WebSocketGateway,
  MessageBody,
  ConnectedSocket,
  BaseWsExceptionFilter,
  OnGatewayDisconnect
} from '@nestjs/websockets';
import { UseFilters } from '@nestjs/common';
import { CreateUserRequest, CreateUserResponse } from 'src/interfaces/user';
import { Socket } from 'socket.io';
import { UserService } from 'src/services/user/user.service';

@WebSocketGateway({ cors: true })
export class UserGateway implements OnGatewayDisconnect {
  constructor(private userService: UserService) { }

  handleDisconnect(client: Socket) {
  }

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
