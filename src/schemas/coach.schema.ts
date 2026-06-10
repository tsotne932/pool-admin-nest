import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { RECORD_STATE } from '../config/constants';

export type CoachDocument = Coach & Document;

@Schema({ timestamps: true })
export class Coach {
  @Prop({ required: true })
  name: string;

  @Prop()
  email: string;

  @Prop()
  phone: string;

  @Prop({ type: Types.ObjectId, ref: 'pool' })
  pool: Types.ObjectId;

  @Prop({ type: [Types.ObjectId], ref: 'groups' })
  groups: Types.ObjectId[];

  @Prop({ type: Number, default: RECORD_STATE.ACTIVE })
  recordState: number;

  @Prop({ type: [Object] })
  history: Record<string, any>[];
}

export const CoachSchema = SchemaFactory.createForClass(Coach);
