import {
  BaseWsExceptionFilter,
  SubscribeMessage,
  WebSocketGateway,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets';
import { UseFilters } from '@nestjs/common';
import { TrafficService } from 'src/services/traffic/traffic.service';
import { Server } from 'socket.io';
import { CreateTrafficDTO, TrafficIdDTO } from 'src/dto/traffic';
import { TRAFFIC_EVENT_ENUM } from 'src/schemas/traffic.schema';
import { UserService } from 'src/services/user/user.service';

@WebSocketGateway({ cors: true })
export class TrafficGateway {
  constructor(
    private trafficService: TrafficService,
    private userService: UserService
  ) { }

  @WebSocketServer()
  server: Server;

  @UseFilters(new BaseWsExceptionFilter())
  @SubscribeMessage('traffic:create')
  async handleCreateTraffic(
    @MessageBody() body: CreateTrafficDTO,
  ) {
    const createdTraffic = await this.trafficService.createTraffic(body.userId, body);
    Promise.allSettled(Array.from(this.server.sockets.sockets.values(), async (socket) => {
      const user = await this.userService.findUserFromSocketId(socket.id);
      if (!user) return;
      socket.emit(
        'traffic:create',
        await this.trafficService.queryPublicTrafficById(user.id, createdTraffic.id),
      );
    }));
    return;
  }

  @UseFilters(new BaseWsExceptionFilter())
  @SubscribeMessage('traffic:end-service')
  async handleEndTrafficService(@MessageBody() body: TrafficIdDTO) {
    const endedTraffic = await this.trafficService.updateTrafficStatus(body.userId, body.id, TRAFFIC_EVENT_ENUM.END_SERVICE);
    this.server.emit('traffic:end-service', new TrafficIdDTO(endedTraffic));
    return;
  }

  @UseFilters(new BaseWsExceptionFilter())
  @SubscribeMessage('traffic:delete')
  async handleDeleteTraffic(@MessageBody() body: TrafficIdDTO) {
    const deletedTraffic = await this.trafficService.updateTrafficStatus(body.userId, body.id, TRAFFIC_EVENT_ENUM.DELETED);
    this.server.emit('traffic:delete', new TrafficIdDTO(deletedTraffic));
    return;
  }

  @UseFilters(new BaseWsExceptionFilter())
  @SubscribeMessage('traffic:begin-service')
  async handleUpdate(
    @MessageBody() body: TrafficIdDTO,
  ) {
    const updateTraffic = await this.trafficService.updateTrafficStatus(body.userId, body.id, TRAFFIC_EVENT_ENUM.BEGIN_SERVICE);
    this.server.emit('traffic:begin-service', new TrafficIdDTO(updateTraffic));
    return;
  }
}
