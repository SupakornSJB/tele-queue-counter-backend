import {
  BaseWsExceptionFilter,
  ConnectedSocket,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { UserService } from 'src/services/user/user.service';
import { UseFilters } from '@nestjs/common';
import { TrafficService } from 'src/services/traffic/traffic.service';
import { ServerService } from 'src/services/server/server.service';

@WebSocketGateway({ cors: true })
export class MainGateway {
  constructor(
    private userService: UserService,
    private trafficService: TrafficService,
    private serverService: ServerService,
  ) {}

  @UseFilters(new BaseWsExceptionFilter())
  @SubscribeMessage('sync-all')
  handleNewUserDataSync(@ConnectedSocket() client: Socket) {
    client.emit('sync-all', {
      user: this.userService.getPublicUser(client.id, client.id),
      servers: this.serverService.getServers(),
      traffics: this.trafficService.getAllPublicTraffic(client.id),
    });
    return;
  }
}
