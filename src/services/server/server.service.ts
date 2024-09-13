import { Injectable, Scope } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SERVER_EVENT_ENUM, Server, ServerEvent, ServerEventDocument } from 'src/schemas/server.schema';
import { Model } from 'mongoose';
import { PublicServerDTO } from 'src/dto/server';

@Injectable({ scope: Scope.DEFAULT })
export class ServerService {
  constructor(
    @InjectModel('Server') private serverModel: Model<Server>,
    @InjectModel('ServerEvent') private serverEventModel: Model<ServerEvent>,
  ) { }

  async queryIsActive(serverId: string): Promise<boolean> {
    const serverEventList = await this.serverEventModel.find({
      server: serverId,
      $or: [
        {
          event: SERVER_EVENT_ENUM.SAVED
        },
        {
          event: SERVER_EVENT_ENUM.DELETE
        }
      ]
    });
    return serverEventList.length === 0;
  }

  getIsActive(serverEventQuery: ServerEventDocument[]) {
    return serverEventQuery.filter((event) => event.event === SERVER_EVENT_ENUM.SAVED || event.event === SERVER_EVENT_ENUM.DELETE).length === 0;
  }

  public async createServer(
    creatorId: string,
    name: string,
  ): Promise<PublicServerDTO> {
    const newServer = new this.serverModel({
      name,
    });
    await newServer.save();
    await this.updateServerStatus(creatorId, newServer.id, SERVER_EVENT_ENUM.CREATED);
    return new PublicServerDTO(newServer, true);
  }

  public async getAllActiveServer(): Promise<PublicServerDTO[]> {
    const serverList = await this.serverModel.find();
    const activeList = serverList.filter(async server => await this.queryIsActive(server.id));
    return activeList.map((server) => new PublicServerDTO(server, true));
  }

  public async updateServerStatus(
    ownerId: string,
    serverId: string,
    eventEnum: SERVER_EVENT_ENUM
  ): Promise<PublicServerDTO> {
    const server = await this.serverModel.findById(serverId);
    if (!server) throw new Error("Server Not Found");
    const event = new this.serverEventModel({
      server: server.id,
      event: eventEnum,
      timestamp: new Date(),
      owner: ownerId,
    });
    await event.save();
    return new PublicServerDTO(server, this.getIsActive(await this.serverEventModel.find({ server: serverId })))
  }
}
