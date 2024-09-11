import { UserDocument } from "src/schemas/user.schema";
import { BaseDTO } from "./base";

export class CreateUserDTO extends BaseDTO {
  readonly name: string;
}

export class AuthUserDTO extends BaseDTO {
  readonly token: string;
}

export class UserEventDTO extends BaseDTO {
  readonly eventName: string;
}

export class UserDTO extends BaseDTO {
  readonly name: string;

  constructor(user: UserDocument) {
    super();
    this.name = user.name;
  }
}
