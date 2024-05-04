import {
  BaseWsExceptionFilter,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { UseFilters } from '@nestjs/common';
import {
  CreateServerRequest,
  DeleteServerRequest,
  SaveAndDeleteServerRequest,
} from 'src/interfaces/server';
import { ServerService } from 'src/services/server/server.service';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: true })
export class ServerGateway {
  constructor(private serverService: ServerService) {}

  @WebSocketServer()
  server: Server;

  @UseFilters(new BaseWsExceptionFilter())
  @SubscribeMessage('server:create')
  async handleCreateServer(@MessageBody() body: CreateServerRequest) {
    const createdServer = await this.serverService.createServer(body);
    this.server.emit('server:create', createdServer);
    return;
  }

  @UseFilters(new BaseWsExceptionFilter())
  @SubscribeMessage('server:delete')
  handleDeleteServer(@MessageBody() body: DeleteServerRequest) {
    const deletedServer = this.serverService.deleteServer(body);
    this.server.emit('server:delete', deletedServer);
    return;
  }

  @UseFilters(new BaseWsExceptionFilter())
  @SubscribeMessage('server:save-and-delete')
  async handleSaveThenDelete(@MessageBody() body: SaveAndDeleteServerRequest) {
    const deletedServer = await this.serverService.saveAndDeleteServer(body);
    this.server.emit('server:delete', deletedServer);
    return;
  }
}
