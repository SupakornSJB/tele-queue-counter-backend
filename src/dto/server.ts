import { SERVER_EVENT_ENUM, ServerDocument, ServerEventDocument } from "src/schemas/server.schema";
import { BaseDTO } from "./base";

export class CreateServerDTO extends BaseDTO {
  readonly name: string;
}

export class ServerEventDTO extends BaseDTO {
  readonly id: string;
  readonly eventName: SERVER_EVENT_ENUM;
}

export class ServerIdDTO extends BaseDTO {
  readonly id: string;

  constructor(server: Partial<ServerDocument>) {
    super();
    this.id = server.id
  }
}

export class ServerDTO extends BaseDTO {
  readonly id: string;
  readonly name: string;

  constructor(server: ServerDocument) {
    super();
    this.id = server.id;
    this.name = server.name;
  }
}

export class PublicServerDTO extends ServerDTO {
  readonly isActive: boolean;
  readonly creationTime: Date;

  constructor(server: ServerDocument, createEvent: ServerEventDocument, isActive: boolean) {
    super(server);
    this.isActive = isActive;
    this.creationTime = createEvent.timestamp;
  }
}
