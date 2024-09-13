import {
  BaseWsExceptionFilter,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { UseFilters } from '@nestjs/common';
import { ServerService } from 'src/services/server/server.service';
import { Server } from 'socket.io';
import { CreateServerDTO, ServerIdDTO } from 'src/dto/server';
import { SERVER_EVENT_ENUM } from 'src/schemas/server.schema';

@WebSocketGateway()
export class ServerGateway {
  constructor(private serverService: ServerService) { }

  @WebSocketServer()
  server: Server;

  @UseFilters(new BaseWsExceptionFilter())
  @SubscribeMessage('server:create')
  async handleCreateServer(@MessageBody() body: CreateServerDTO) {
    const createdServer = await this.serverService.createServer(body.userId, body.name);
    this.server.emit('server:create', createdServer);
    return;
  }

  @UseFilters(new BaseWsExceptionFilter())
  @SubscribeMessage('server:delete')
  async handleDeleteServer(@MessageBody() body: ServerIdDTO) {
    const deletedServer = await this.serverService.updateServerStatus(body.userId, body.id, SERVER_EVENT_ENUM.DELETE);
    this.server.emit('server:delete', new ServerIdDTO(deletedServer));
    return;
  }

  @UseFilters(new BaseWsExceptionFilter())
  @SubscribeMessage('server:save-and-delete')
  async handleSaveThenDelete(@MessageBody() body: ServerIdDTO) {
    const deletedServer = await this.serverService.updateServerStatus(body.userId, body.id, SERVER_EVENT_ENUM.DELETE);
    this.server.emit('server:save-and-delete', new ServerIdDTO(deletedServer));
    return;
  }
}
