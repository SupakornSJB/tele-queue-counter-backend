import { Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { InjectModel } from '@nestjs/mongoose';
import { UserDTO } from 'src/dto/user';
import { Model } from 'mongoose';
import { User, UserDocument, UserEvent } from 'src/schemas/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private userModel: Model<User>,
    @InjectModel('UserEvent') private userEventModel: Model<UserEvent>
  ) { }

  public async createUser(username: string): Promise<UserDTO> {
    if (this.findUserByName(username))
      throw new WsException("Cannot Create User: already exist");

    const newUser = new this.userModel({ name: username })
    const createEvent = new this.userEventModel({ user: newUser.id, name: "Created", timestamp: Date.now() })

    await newUser.save();
    await createEvent.save();

    return new UserDTO(newUser);
  }

  public async deleteUser(username: string) {
    const user = await this.findUserByName(username);
    if (!user)
      throw new WsException("Cannot Delete User: user does not exist")

    const loggedOutEvent = new this.userEventModel({
      user: user.id,
      name: "LoggedOut",
      timestamp: Date.now()
    })
    await loggedOutEvent.save();
  }

  public async findUserByName(username: string): Promise<UserDocument | null> {
    return await this.userModel.findOne({ name: username }).exec()
  }
}
