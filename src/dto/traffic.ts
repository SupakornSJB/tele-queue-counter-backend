import { TRAFFIC_EVENT_ENUM, TrafficDocument } from "src/schemas/traffic.schema";
import { BaseDTO } from "./base";
import { ServerIdDTO } from "./server";
import { TrafficEventDocument } from "src/schemas/traffic.schema";

export class CreateTrafficDTO extends BaseDTO {
  readonly serverId: string;
}

export class TrafficEventDTO extends BaseDTO {
  readonly id: string;
  readonly eventName: TRAFFIC_EVENT_ENUM;
}

export class TrafficIdDTO extends BaseDTO {
  readonly id: string;

  constructor(traffic: Partial<TrafficDocument> | TrafficDTO) {
    super();
    this.id = traffic.id;
  }
}

export class TrafficDTO extends BaseDTO {
  readonly id: string;
  readonly server: ServerIdDTO;
  readonly isWaiting: boolean;
  readonly creationTime: Date;

  constructor(traffic: TrafficDocument, createEvent: TrafficEventDocument, isWaiting: boolean) {
    super();
    this.id = traffic.id;
    this.server = new ServerIdDTO(traffic.server);
    this.creationTime = createEvent.timestamp;
    this.isWaiting = isWaiting;
  }
}

export class TrafficDTOIncludeOwnership extends TrafficDTO {
  readonly isOwner: boolean;

  constructor(traffic: TrafficDocument, createEvent: TrafficEventDocument, isOwner: boolean, isWaiting: boolean) {
    super(traffic, createEvent, isWaiting);
    this.isOwner = isOwner;
  }
}
