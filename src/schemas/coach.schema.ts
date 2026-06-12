import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { RECORD_STATE, USER_GROUPS } from '../config/constants';

export type CoachDocument = Coach & Document;

@Schema({ timestamps: true })
export class Coach {
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

  @Prop({ type: Object })
  pool: Record<string, any>;

  @Prop({ type: Number, default: RECORD_STATE.ACTIVE })
  recordState: number;

  @Prop({ type: Number, default: USER_GROUPS.COACH })
  userGroupId: number;

  @Prop({ type: Boolean, default: false })
  isVerified: boolean;

  @Prop({ type: Date, default: () => new Date() })
  timestamp: Date;
}

export const CoachSchema = SchemaFactory.createForClass(Coach);
