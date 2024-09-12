import { Injectable, Scope } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Traffic, TrafficDocument, TrafficEvent } from 'src/schemas/traffic.schema';
import { CreateTrafficDTO, TrafficDTOIncludeOwnership, TrafficDTO } from 'src/dto/traffic';
import { TRAFFIC_EVENT_ENUM } from 'src/schemas/traffic.schema';

@Injectable({ scope: Scope.DEFAULT })
export class TrafficService {
  constructor(
    private userService: UserService,
    @InjectModel('Traffic') private trafficModel: Model<Traffic>,
    @InjectModel('TrafficEvent') private trafficEventModel: Model<TrafficEvent>,
  ) { }

  async queryIsWaiting(trafficId: string): Promise<boolean> {
    return !!!(await this.trafficEventModel.findOne({ traffic: trafficId, event: TRAFFIC_EVENT_ENUM.BEGIN_SERVICE }))
  }

  async queryIsOwner(traffic: TrafficDocument, accessorId: string): Promise<boolean> {
    const user = await this.userService.findUserByName(traffic.owner.name);
    if (!user) throw new Error("User Not Found")
    return user.id === accessorId;
  }

  async convertTrafficDocToPublic(trafficDoc: TrafficDocument, accessorId: string): Promise<TrafficDTOIncludeOwnership> {
    const [isWaiting, isOwner] = await Promise.all([
      this.queryIsWaiting(trafficDoc.id),
      this.queryIsOwner(trafficDoc, accessorId),
    ])
    return new TrafficDTOIncludeOwnership(trafficDoc, isOwner, isWaiting);
  }

  async convertTrafficDocToDTO(trafficDoc: TrafficDocument): Promise<TrafficDTO> {
    const isWaiting = await this.queryIsWaiting(trafficDoc.id);
    return new TrafficDTO(trafficDoc, isWaiting);
  }

  public async queryPublicTrafficById(
    accessorId: string,
    trafficId: string,
  ): Promise<TrafficDTOIncludeOwnership> {
    const traffic = await this.trafficModel.findById(trafficId);
    return this.convertTrafficDocToPublic(traffic, accessorId);
  }

  public async getAllActiveTraffic(accessorId: string): Promise<TrafficDTOIncludeOwnership[]> {
    const userTraffic = await this.trafficModel.find({ owner: accessorId });
    return Promise.all(userTraffic.map((traffic) => this.convertTrafficDocToPublic(traffic, accessorId)));
  }

  public async createTraffic(
    creatorId: string,
    info: CreateTrafficDTO
  ): Promise<TrafficDTOIncludeOwnership> {
    const newTraffic = new this.trafficModel({
      server: info.serverId,
      owner: creatorId,
    })
    await newTraffic.save();
    await this.updateTrafficStatus(creatorId, newTraffic.id, TRAFFIC_EVENT_ENUM.CREATED);
    return this.convertTrafficDocToPublic(newTraffic, creatorId)
  }

  public async updateTrafficStatus(
    accessorId: string,
    trafficId: string,
    trafficEventEnum: TRAFFIC_EVENT_ENUM
  ): Promise<TrafficDTO> {
    const traffic = await this.trafficModel.findById(trafficId);
    if (!traffic) throw new Error("Traffic Not Found");
    const event = new this.trafficEventModel({
      traffic: traffic.id,
      event: trafficEventEnum,
      timestamp: new Date(),
      owner: accessorId,
    })
    await event.save();
    return await this.convertTrafficDocToDTO(traffic);
  }
}
