import { Injectable, Scope } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Traffic, TrafficDocument, TrafficEvent, TrafficEventDocument } from 'src/schemas/traffic.schema';
import { CreateTrafficDTO, TrafficDTOIncludeOwnership, TrafficDTO } from 'src/dto/traffic';
import { TRAFFIC_EVENT_ENUM } from 'src/schemas/traffic.schema';

@Injectable({ scope: Scope.DEFAULT })
export class TrafficService {
  constructor(
    private userService: UserService,
    @InjectModel('Traffic') private trafficModel: Model<Traffic>,
    @InjectModel('TrafficEvent') private trafficEventModel: Model<TrafficEvent>,
  ) { }
  async queryIsActive(trafficId: string): Promise<boolean> {
    const eventList = await this.trafficEventModel.find({
      traffic: trafficId,
      $or: [
        {
          event: TRAFFIC_EVENT_ENUM.DELETED
        },
        {
          event: TRAFFIC_EVENT_ENUM.END_SERVICE
        }
      ]
    });
    return eventList.length === 0;
  }

  async queryWaitingInfo(trafficId: string): Promise<{ isWaiting: boolean, createEvent: TrafficEventDocument }> {
    const [createEvent, beginServiceEvent] = await Promise.allSettled([
      this.trafficEventModel.findOne({ traffic: trafficId, event: TRAFFIC_EVENT_ENUM.CREATED }),
      this.trafficEventModel.findOne({ traffic: trafficId, event: TRAFFIC_EVENT_ENUM.BEGIN_SERVICE }),
    ])

    return {
      isWaiting: beginServiceEvent.status == "fulfilled" ? !!!beginServiceEvent.value : false,
      createEvent: createEvent.status == "fulfilled" ? createEvent.value : null
    }
  }

  async queryIsOwner(traffic: TrafficDocument, accessorId: string): Promise<boolean> {
    const user = await this.userService.findUserByName(traffic.owner.name);
    if (!user) throw new Error("User Not Found")
    return user.id === accessorId;
  }

  async convertTrafficDocToPublic(trafficDoc: TrafficDocument, accessorId: string): Promise<TrafficDTOIncludeOwnership> {
    const [{ isWaiting, createEvent }, isOwner] = await Promise.all([
      this.queryWaitingInfo(trafficDoc.id),
      this.queryIsOwner(trafficDoc, accessorId),
    ])
    return new TrafficDTOIncludeOwnership(trafficDoc, createEvent, isOwner, isWaiting);
  }

  async convertTrafficDocToDTO(trafficDoc: TrafficDocument): Promise<TrafficDTO> {
    const { isWaiting, createEvent } = await this.queryWaitingInfo(trafficDoc.id);
    return new TrafficDTO(trafficDoc, createEvent, isWaiting);
  }

  public async queryPublicTrafficById(
    accessorId: string,
    trafficId: string,
  ): Promise<TrafficDTOIncludeOwnership> {
    const traffic = await this.trafficModel.findById(trafficId);
    return this.convertTrafficDocToPublic(traffic, accessorId);
  }

  public async getAllActiveTraffic(accessorId: string): Promise<TrafficDTOIncludeOwnership[]> {
    const userTraffic = await this.trafficModel.find();
    const activeTraffic = userTraffic.filter(async (traffic) => await this.queryIsActive(traffic.id))
    return Promise.all(activeTraffic.map((traffic) => this.convertTrafficDocToPublic(traffic, accessorId)));
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
