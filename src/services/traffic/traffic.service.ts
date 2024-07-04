import { Injectable, Scope } from '@nestjs/common';
import {
  CreateTrafficRequest,
  DeleteTrafficBroadcastResponse,
  DeleteTrafficRequest,
  ITraffic,
  ITrafficPublic,
  SaveAndDeleteTrafficBroadcastResponse,
  SaveAndDeleteTrafficRequest,
  UpdateTrafficBroadcastResponse,
  UpdateTrafficRequest,
} from 'src/interfaces/traffic';
import { UserService } from '../user/user.service';
import { WsException } from '@nestjs/websockets';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Traffic } from 'src/schemas/traffic.schema';

@Injectable({ scope: Scope.DEFAULT })
export class TrafficService {
  constructor(
    private userService: UserService,
    @InjectModel('Traffic') private trafficModel: Model<Traffic>,
  ) {}

  private traffics: Map<string, Omit<ITraffic, 'id'>> = new Map();
  private currentHighestId = 0;

  public getPublicTraffic(
    socketId: string,
    id: string,
    throwOnError = true,
  ): ITrafficPublic {
    if (!this.traffics.has(id)) throw new WsException('Traffic not found');
    const findTrafficResult = this.traffics.get(id);

    try {
      const findUserResult = this.userService.getPublicUser(
        socketId,
        findTrafficResult.ownerId,
      );
      return {
        id,
        ...findTrafficResult,
        owner: findUserResult,
        isWaiting: findTrafficResult.beginServiceTime == null,
      };
    } catch (e: unknown) {
      if (throwOnError) throw e;
      else {
        return {
          id,
          ...findTrafficResult,
          owner: {
            name: 'Unknown',
            color: '000000',
            isOwner: false,
          },
          isWaiting: findTrafficResult.beginServiceTime == null,
        };
      }
    }
  }

  public getAllPublicTraffic(socketId: string): ITrafficPublic[] {
    return Array.from(this.traffics.keys()).map((key) =>
      this.getPublicTraffic(socketId, key, false),
    );
  }

  public createTraffic(
    socketId: string,
    info: CreateTrafficRequest,
  ): ITrafficPublic {
    const id = this.getNewId();
    this.traffics.set(id, {
      serverId: info.serverId,
      note: '',
      ownerId: socketId,
      startTime: new Date().toISOString(),
      beginServiceTime: null,
    });
    const publicTraffic = this.getPublicTraffic(socketId, id);
    return publicTraffic;
  }

  public deleteTraffic(
    info: DeleteTrafficRequest,
  ): DeleteTrafficBroadcastResponse {
    if (!this.traffics.delete(info.id))
      throw new WsException('Traffic not found');
    return info;
  }

  public async saveAndDeleteTraffic(
    info: SaveAndDeleteTrafficRequest,
  ): Promise<SaveAndDeleteTrafficBroadcastResponse> {
    if (!this.traffics.has(info.id)) throw new WsException('Traffic Not Found');
    const traffic = this.traffics.get(info.id);

    const newTrafficModel = new this.trafficModel({
      server: traffic.serverId,
      startTime: new Date(traffic.startTime).toISOString(),
      beginServiceTime: new Date(traffic.beginServiceTime).toISOString(),
      endTime: new Date().toISOString(),
    });
    await newTrafficModel.save();
    return { id: info.id };
  }

  public updateTraffic(
    socketId: string,
    info: UpdateTrafficRequest,
  ): UpdateTrafficBroadcastResponse {
    const traffic = { ...this.traffics.get(info.id) };
    traffic.beginServiceTime = new Date().toISOString();
    this.traffics.set(info.id, traffic);
    return {
      change: this.getPublicTraffic(socketId, info.id),
    };
  }

  private getNewId() {
    return (this.currentHighestId++).toString();
  }
}
