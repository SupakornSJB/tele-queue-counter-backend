import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Server } from './server.schema';

export type TrafficDocument = HydratedDocument<Traffic>;

@Schema()
export class Traffic {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Server' })
  server: Server;

  @Prop()
  startTime: Date;

  @Prop()
  beginServiceTime: Date;

  @Prop()
  endTime: Date;
}

export const TrafficSchema = SchemaFactory.createForClass(Traffic);
