import {
  BaseWsExceptionFilter,
  SubscribeMessage,
  WebSocketGateway,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { WsException } from '@nestjs/websockets';
import { UseFilters } from '@nestjs/common';
import { TrafficService } from 'src/services/traffic/traffic.service';
import { Socket, Server } from 'socket.io';
import { CreateTrafficDTO, TrafficIdDTO } from 'src/dto/traffic';
import { TRAFFIC_EVENT_ENUM } from 'src/schemas/traffic.schema';

@WebSocketGateway({ cors: true })
export class TrafficGateway {
  constructor(private trafficService: TrafficService) { }

  @WebSocketServer()
  server: Server;

  @UseFilters(new BaseWsExceptionFilter())
  @SubscribeMessage('traffic:create')
  async handleCreateTraffic(
    @MessageBody() body: CreateTrafficDTO,
  ) {
    throw new Error("Method Not Implemented: Socket ID should not be used for user id anymore, pls change");
    const createdTraffic = await this.trafficService.createTraffic(body.userId, body);
    this.server.sockets.sockets.forEach(async (socket) => {
      socket.emit(
        'traffic:create',
        await this.trafficService.queryPublicTrafficById(socket.id, createdTraffic.id),
      );
    });
    // this.server.emit('traffic:create', createdTraffic);
    return;
  }

  @UseFilters(new BaseWsExceptionFilter())
  @SubscribeMessage('traffic:end-service')
  async handleEndTrafficService(@MessageBody() body: TrafficIdDTO) {
    const endedTraffic = await this.trafficService.updateTrafficStatus(body.userId, body.id, TRAFFIC_EVENT_ENUM.END_SERVICE);
    this.server.emit('traffic:end-service', endedTraffic);
    return;
  }

  @UseFilters(new BaseWsExceptionFilter())
  @SubscribeMessage('traffic:delete')
  async handleDeleteTraffic(@MessageBody() body: TrafficIdDTO) {
    const deletedTraffic = await this.trafficService.updateTrafficStatus(body.userId, body.id, TRAFFIC_EVENT_ENUM.DELETED);
    this.server.emit('traffic:delete', deletedTraffic);
    return;
  }

  @UseFilters(new BaseWsExceptionFilter())
  @SubscribeMessage('traffic:begin-service')
  handleUpdate(
    @MessageBody() body: TrafficIdDTO,
  ) {
    const updateTraffic = this.trafficService.updateTrafficStatus(body.userId, body.id, TRAFFIC_EVENT_ENUM.BEGIN_SERVICE);
    this.server.emit('traffic:begin-service', updateTraffic);
    return;
  }
}
