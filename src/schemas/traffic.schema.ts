import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Server } from './server.schema';
import { User } from './user.schema';

const TRAFFIC_EVENT_ENUM = ["Start", "BeginService", "EndService"]

export type TrafficDocument = HydratedDocument<Traffic>;
export type TrafficEventDocument = HydratedDocument<TrafficEvent>;

@Schema()
export class Traffic {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Server' })
  server: Server;
}

export class TrafficEvent {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Traffic', required: true })
  traffic: Traffic

  @Prop({ enum: TRAFFIC_EVENT_ENUM, required: true })
  event: string

  @Prop()
  timestamp: Date

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  owner: User
}

export const TrafficSchema = SchemaFactory.createForClass(Traffic);
export const TrafficEventSchema = SchemaFactory.createForClass(TrafficEvent);
