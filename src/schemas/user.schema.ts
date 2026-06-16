import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { RECORD_STATE } from '../config/constants';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  userName: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  email: string;

  @Prop({ type: Object })
  profile: Record<string, any>;

  @Prop({ type: Object })
  contact: Record<string, any>;

  @Prop({ type: Types.ObjectId, ref: 'Pool' })
  pool: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Card' })
  card: Types.ObjectId;

  @Prop({ type: Number, default: RECORD_STATE.ACTIVE })
  recordState: number;

  @Prop({ type: Number, default: 1 })
  userGroupId: number;

  @Prop({ type: [Object] })
  history: Record<string, any>[];
  
}

export const UserSchema = SchemaFactory.createForClass(User);
