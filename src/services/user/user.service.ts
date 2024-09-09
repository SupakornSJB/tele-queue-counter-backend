import { Injectable, Scope } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import {
  CreateUserRequest,
  DeleteUserRequest,
  IUser,
  IUserPublic,
} from 'src/interfaces/user';

@Injectable({ scope: Scope.DEFAULT })
export class UserService {
  public getPublicUser(socketId: string, id: string): IUserPublic {
    if (!this.users.has(id))
      throw new WsException('No user with this id is found');
    const user = this.users.get(id);
    return {
      isOwner: socketId == id,
      name: user.name,
      color: user.color,
    };
  }

  public createUser(socketId: string, info: CreateUserRequest): string {
    this.users.set(socketId, {
      name: info.name,
      color: info.color,
    });

    return socketId;
  }

  public deleteUser(info: DeleteUserRequest): string {
    if (!this.users.has(info.id)) {
      throw new WsException('User Deletion Error');
    }

    this.users.delete(info.id);
    return info.id;
  }

  public async findUserByName(username: string): Promise<IUser | null> {
    throw new Error("Method not implemented");
  }
}
