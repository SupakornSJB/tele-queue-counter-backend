import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from './user.schema';

const SERVER_EVENT_ENUM = [
  "Created", "Saved", "Deleted",
]

export type ServerDocument = HydratedDocument<Server>;
export type ServerEventDocument = HydratedDocument<ServerEvent>;

@Schema()
export class Server {
  @Prop()
  name: string;
}

@Schema()
export class ServerEvent {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Server', required: true })
  server: Server;

  @Prop({ enum: SERVER_EVENT_ENUM, required: true })
  name: string

  @Prop()
  timestamp: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  owner: User
}

export const ServerSchema = SchemaFactory.createForClass(Server);
export const ServerTimeSchema = SchemaFactory.createForClass(ServerEvent);
