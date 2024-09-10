import { TrafficDocument } from "src/schemas/traffic.schema";
import { Server } from "src/schemas/server.schema";

export class CreateTrafficDTO {
  readonly serverId: string;
}

export class TrafficEventDTO {
  readonly id: string;
  readonly eventName: string;
}

export class PublicTrafficDTO {
  readonly id: string
  readonly server: Server
  readonly isOwner: boolean;
  readonly isWaiting: boolean;

  constructor(traffic: TrafficDocument, isOwner: boolean, isWaiting: boolean) {
    this.id = traffic.id;
    this.server = traffic.server
    this.isOwner = isOwner;
    this.isWaiting = isWaiting;
  }
}
