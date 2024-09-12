import { Injectable, Inject } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { InjectModel } from '@nestjs/mongoose';
import { UserDTO } from 'src/dto/user';
import { Model } from 'mongoose';
import { USER_EVENT_ENUM, User, UserDocument, UserEvent } from 'src/schemas/user.schema';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private userModel: Model<User>,
    @InjectModel('UserEvent') private userEventModel: Model<UserEvent>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) { }

  public async createUser(username: string): Promise<UserDTO> {
    if (this.findUserByName(username))
      throw new WsException("Cannot Create User: already exist");

    const newUser = new this.userModel({ name: username })
    const createEvent = new this.userEventModel({ user: newUser.id, name: USER_EVENT_ENUM.CREATED, timestamp: Date.now() })

    await newUser.save();
    await createEvent.save();

    return new UserDTO(newUser);
  }

  public async updateUserStatus(username: string, newEvent: USER_EVENT_ENUM) {
    const user = await this.findUserByName(username);
    if (!user)
      throw new WsException("Cannot Perform Action: user does not exist")

    const loggedOutEvent = new this.userEventModel({
      user: user.id,
      name: newEvent,
      timestamp: Date.now()
    })
    await loggedOutEvent.save();
  }

  public async findUserByName(username: string): Promise<UserDocument | null> {
    return await this.userModel.findOne({ name: username }).exec()
  }

  public async findUserById(userId: string): Promise<UserDocument | null> {
    return await this.userModel.findById(userId).exec();
  }

  public async findUserFromSocketId(socketId: string): Promise<UserDocument | null> {
    return await this.cacheManager.get(this.formatSocketIdUserIdMapKey(socketId));
  }

  public async saveUsersSocketId(socketId: string, userId: string) {
    return await this.cacheManager.set(this.formatSocketIdUserIdMapKey(socketId), userId, 0)
  }

  public async removeUsersWithSocketId(socketId: string) {
    const user = await this.findUserFromSocketId(socketId);
    if (!user) throw new Error("User with this socket Id cannot be found");
    return await this.cacheManager.del(this.formatSocketIdUserIdMapKey(socketId))
  }

  formatSocketIdUserIdMapKey(socketId: string) {
    return `socket-id-${socketId}`
  }
}
