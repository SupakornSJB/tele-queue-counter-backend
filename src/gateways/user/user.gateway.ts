import {
  SubscribeMessage,
  WebSocketGateway,
  MessageBody,
  BaseWsExceptionFilter,
  OnGatewayDisconnect,
  ConnectedSocket
} from '@nestjs/websockets';
import { UseFilters } from '@nestjs/common';
import { CreateUserDTO, UserDTO } from 'src/dto/user';
import { Socket } from 'socket.io';
import { UserService } from 'src/services/user/user.service';
import { Public } from 'src/guards/auth.guard';
import { JwtService } from '@nestjs/jwt';
import { USER_EVENT_ENUM } from 'src/schemas/user.schema';

@WebSocketGateway({ cors: true })
export class UserGateway implements OnGatewayDisconnect {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) { }

  async handleDisconnect(client: Socket) {
    await this.userService.removeUsersWithSocketId(client.id);
  }

  @Public()
  @UseFilters(new BaseWsExceptionFilter())
  @SubscribeMessage('user:auth')
  async handleAuthentication(
    @MessageBody() body: CreateUserDTO,
    @ConnectedSocket() socket: Socket
  ) {
    let user = await this.userService.findUserByName(body.name).then((userDocument) => new UserDTO(userDocument));
    if (!user)
      user = await this.userService.createUser(body.name);

    const [_, token] = await Promise.all([
      this.userService.updateUserStatus(body.name, USER_EVENT_ENUM.LOGGED_IN),
      this.generateToken(user)
    ])
    this.userService.saveUsersSocketId(socket.id, token);
    return token;
  }

  async generateToken(payload: UserDTO) {
    const signedToken = this.jwtService.sign(payload);
    return signedToken;
  }
}
