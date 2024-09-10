import { ServerDocument } from "src/schemas/server.schema";

export class CreateServerDTO {
  readonly name: string;
}

export class ServerEventDTO {
  readonly id: string;
  readonly eventName: string;
}

export class PublicServerDTO {
  readonly id: string;
  readonly name: string;

  constructor(server: ServerDocument) {
    this.id = server.id;
    this.name = server.name;
  }
}
