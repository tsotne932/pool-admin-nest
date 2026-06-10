import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { RECORD_STATE } from '../config/constants';

export type RaceDocument = Race & Document;

@Schema({ timestamps: true })
export class Race {
  @Prop()
  event: string;

  @Prop()
  title: string;

  @Prop()
  distance: number;

  @Prop()
  sex: string;

  @Prop({ type: Boolean, default: false })
  isSelection: boolean;

  @Prop({ type: Object, default: {} })
  participants: Record<string, any>;

  @Prop({ type: Number, default: RECORD_STATE.ACTIVE })
  recordState: number;
}

export const RaceSchema = SchemaFactory.createForClass(Race);
