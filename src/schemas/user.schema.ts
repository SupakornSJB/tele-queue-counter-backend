import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";

const USER_EVENT_ENUM = ["Created", "LoggedOut"]

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
