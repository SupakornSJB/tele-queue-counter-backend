import {
  SubscribeMessage,
  WebSocketGateway,
  MessageBody,
  BaseWsExceptionFilter,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { UseFilters } from '@nestjs/common';
import { CreateUserDTO, UserDTO } from 'src/dto/user';
import { Socket } from 'socket.io';
import { UserService } from 'src/services/user/user.service';
import { Public } from 'src/guards/auth.guard';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({ cors: true })
export class UserGateway implements OnGatewayDisconnect {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) { }

  handleDisconnect(client: Socket) {
  }

  @Public()
  @UseFilters(new BaseWsExceptionFilter())
  @SubscribeMessage('user:auth')
  async handleAuthentication(
    @MessageBody() body: CreateUserDTO,
  ) {
    let user = await this.userService.findUserByName(body.name).then((userDocument) => new UserDTO(userDocument));
    if (!user)
      user = await this.userService.createUser(body.name);
    return this.generateToken(user);
  }

  async generateToken(payload: UserDTO) {
    const signedToken = this.jwtService.sign(payload);
    return signedToken;
  }
}
