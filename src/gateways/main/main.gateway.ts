import {
  BaseWsExceptionFilter,
  ConnectedSocket,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { UseFilters } from '@nestjs/common';
import { TrafficService } from 'src/services/traffic/traffic.service';
import { ServerService } from 'src/services/server/server.service';

@WebSocketGateway({ cors: true })
export class MainGateway {
  constructor(
    private trafficService: TrafficService,
    private serverService: ServerService,
  ) { }

  @UseFilters(new BaseWsExceptionFilter())
  @SubscribeMessage('sync-all')
  handleNewUserDataSync(@ConnectedSocket() client: Socket) {
    client.emit('sync-all', {
      servers: this.serverService.getAllActiveServer(),
      traffics: this.trafficService.getAllActiveTraffic(client.id),
    });
    return;
  }
}
