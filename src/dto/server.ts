import { ServerDocument } from "src/schemas/server.schema";
import { BaseDTO } from "./base";

export class CreateServerDTO extends BaseDTO {
  readonly name: string;
}

export class ServerEventDTO extends BaseDTO {
  readonly id: string;
  readonly eventName: string;
}

export class PublicServerDTO extends BaseDTO {
  readonly id: string;
  readonly name: string;

  constructor(server: ServerDocument) {
    super();
    this.id = server.id;
    this.name = server.name;
  }
}
