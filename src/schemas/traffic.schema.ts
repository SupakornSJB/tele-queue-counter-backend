import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Server } from './server.schema';
import { User } from './user.schema';

export enum TRAFFIC_EVENT_ENUM {
  CREATED = "Created",
  BEGIN_SERVICE = "BeginService",
  END_SERVICE = "EndService",
  DELETED = "Deleted"
}

export type TrafficDocument = HydratedDocument<Traffic>;
export type TrafficEventDocument = HydratedDocument<TrafficEvent>;

@Schema()
export class Traffic {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Server' })
  server: Server;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  owner: User
}

export class TrafficEvent {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Traffic', required: true })
  traffic: Traffic

  @Prop({ enum: TRAFFIC_EVENT_ENUM, required: true })
  event: TRAFFIC_EVENT_ENUM

  @Prop()
  timestamp: Date

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  owner: User
}

export const TrafficSchema = SchemaFactory.createForClass(Traffic);
export const TrafficEventSchema = SchemaFactory.createForClass(TrafficEvent);
