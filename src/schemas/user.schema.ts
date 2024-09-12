import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";

export enum USER_EVENT_ENUM {
  CREATED = "Created",
  LOGGED_IN = "LoggedIn",
  LOGGED_OUT = "LoggedOut"
}

export type UserDocument = HydratedDocument<User>;
export type UserEventDocument = HydratedDocument<UserEvent>;

@Schema()
export class User {
  @Prop()
  name: string;
}

@Schema()
export class UserEvent {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true })
  user: User

  @Prop({ enum: USER_EVENT_ENUM, required: true })
  name: string

  @Prop()
  timestamp: Date
}

export const UserSchema = SchemaFactory.createForClass(User);
export const UserEventSchema = SchemaFactory.createForClass(UserEvent);
