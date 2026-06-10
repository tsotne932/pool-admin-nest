import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { RECORD_STATE } from '../config/constants';

export type EventDocument = Event & Document;

@Schema({ timestamps: true })
export class Event {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop()
  startDate: string;

  @Prop()
  endDate: string;

  @Prop({ type: Types.ObjectId, ref: 'pool' })
  pool: Types.ObjectId;

  @Prop({ type: [Types.ObjectId], ref: 'users' })
  participants: Types.ObjectId[];

  @Prop({ type: Number, default: RECORD_STATE.ACTIVE })
  recordState: number;

  @Prop({ type: [Object] })
  history: Record<string, any>[];
}

export const EventSchema = SchemaFactory.createForClass(Event);
