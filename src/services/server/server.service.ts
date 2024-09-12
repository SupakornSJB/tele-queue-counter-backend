import { Injectable, Scope } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { WsException } from '@nestjs/websockets';
import { Server, ServerEvent } from 'src/schemas/server.schema';
import { Model } from 'mongoose';

@Injectable({ scope: Scope.DEFAULT })
export class ServerService {
  constructor(
    @InjectModel('Server') private serverModel: Model<Server>,
    @InjectModel('ServerEvent') private serverEventModel: Model<ServerEvent>,
  ) { }

  async createServer(
    info: CreateServerRequest,
  ): Promise<CreateServerBroadcastResponse> {
    const newServer = new this.serverModel({
      name: info.name,
    });

    const newServerEvent = new this.serverEventModel({
      server: newServer._id,
      name: "Created",
      timestamp: Date.now(),
    })
    const savedServer = await newServer.save();

    return {
      id: savedServer.id,
      ...newServer,
    };
  }

  getServers(): IServer[] {
    return Array.from(this.servers.entries()).map((serverArr) => {
      return { id: serverArr[0], ...serverArr[1] };
    });
  }

  deleteServer(info: DeleteServerRequest): DeleteServerBroadcaseResponse {
    if (!this.servers.delete(info.id))
      throw new WsException('Server not found');
    return {
      id: info.id,
    };
  }

  async saveAndDeleteServer(
    info: SaveAndDeleteServerRequest,
  ): Promise<SaveAndDeleteServerBroadcastResponse> {
    const serverQuery = await this.serverModel.findById(info.id).exec();
    if (!this.servers.has(info.id) || !serverQuery)
      throw new WsException('Servers not Found');

    const server = this.servers.get(info.id);
    const savedServer = new this.serverEventModel({
      server: serverQuery,
      startTime: new Date(server.startTime).toISOString(),
      endTime: new Date().toISOString(),
    });
    await savedServer.save();
    this.deleteServer(info);
    return {
      id: info.id,
    };
  }
}
