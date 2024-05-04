import {
  BaseWsExceptionFilter,
  SubscribeMessage,
  WebSocketGateway,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { UseFilters } from '@nestjs/common';
import {
  CreateTrafficRequest,
  DeleteTrafficRequest,
  UpdateTrafficRequest,
} from 'src/interfaces/traffic';
import { TrafficService } from 'src/services/traffic/traffic.service';
import { Socket, Server } from 'socket.io';

@WebSocketGateway({ cors: true })
export class TrafficGateway {
  constructor(private trafficService: TrafficService) {}

  @WebSocketServer()
  server: Server;

  @UseFilters(new BaseWsExceptionFilter())
  @SubscribeMessage('traffic:create')
  handleCreateTraffic(
    @MessageBody() body: CreateTrafficRequest,
    @ConnectedSocket() client: Socket,
  ) {
    const createdTraffic = this.trafficService.createTraffic(client.id, body);
    this.server.emit('traffic:create', createdTraffic);
    return;
  }

  @UseFilters(new BaseWsExceptionFilter())
  @SubscribeMessage('traffic:delete')
  handleDeleteTraffic(@MessageBody() body: DeleteTrafficRequest) {
    const deletedTraffic = this.trafficService.deleteTraffic(body);
    this.server.emit('traffic:delete', deletedTraffic);
    return;
  }

  @UseFilters(new BaseWsExceptionFilter())
  @SubscribeMessage('traffic:save-and-delete')
  async handleSaveThenDelete(@MessageBody() body: DeleteTrafficRequest) {
    const deletedTraffic = await this.trafficService.saveAndDeleteTraffic(body);
    this.server.emit('traffic:delete', deletedTraffic);
    return;
  }

  @UseFilters(new BaseWsExceptionFilter())
  @SubscribeMessage('traffic:update')
  handleUpdate(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: UpdateTrafficRequest,
  ) {
    const updateTraffic = this.trafficService.updateTraffic(client.id, body);
    this.server.emit('traffic:update', updateTraffic);
    return;
  }
}
