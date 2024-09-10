import { UserDocument } from "src/schemas/user.schema";

export class CreateUserDTO {
  readonly name: string;
}

export class AuthUserDTO {
  readonly token: string;
}

export class UserEventDTO {
  readonly eventName: string;
}

export class UserDTO {
  readonly name: string;

  constructor(user: UserDocument) {
    this.name = user.name;
  }
}
