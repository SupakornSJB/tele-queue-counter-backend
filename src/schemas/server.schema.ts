import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type ServerDocument = HydratedDocument<Server>;
export type ServerTimeDocument = HydratedDocument<ServerTime>;

@Schema()
export class Server {
  @Prop()
  name: string;
}

@Schema()
export class ServerTime {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Server', required: true })
  server: Server;

  @Prop()
  startTime: Date;

  @Prop()
  endTime: Date;
}

export const ServerSchema = SchemaFactory.createForClass(Server);
export const ServerTimeSchema = SchemaFactory.createForClass(ServerTime);
