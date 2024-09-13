import { TRAFFIC_EVENT_ENUM, TrafficDocument } from "src/schemas/traffic.schema";
import { Server } from "src/schemas/server.schema";
import { BaseDTO } from "./base";

export class CreateTrafficDTO extends BaseDTO {
  readonly serverId: string;
}

export class TrafficEventDTO extends BaseDTO {
  readonly id: string;
  readonly eventName: TRAFFIC_EVENT_ENUM;
}

export class TrafficIdDTO extends BaseDTO {
  readonly id: string;

  constructor(traffic: Partial<TrafficDocument>) {
    super();
    this.id = traffic.id;
  }
}

export class TrafficDTO extends BaseDTO {
  readonly id: string;
  readonly server: Server;
  readonly isWaiting: boolean;

  constructor(traffic: TrafficDocument, isWaiting: boolean) {
    super();
    this.id = traffic.id;
    this.server = traffic.server;
    this.isWaiting = isWaiting;
  }
}

export class TrafficDTOIncludeOwnership extends TrafficDTO {
  readonly isOwner: boolean;

  constructor(traffic: TrafficDocument, isOwner: boolean, isWaiting: boolean) {
    super(traffic, isWaiting);
    this.isOwner = isOwner;
  }
}
