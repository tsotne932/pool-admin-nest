import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { RECORD_STATE } from '../config/constants';

export type HistoryDocument = History & Document;

@Schema({ timestamps: true })
export class History {
  @Prop({ type: Types.ObjectId, required: true })
  dataId: Types.ObjectId;

  @Prop({ type: Number })
  dataType: number;

  @Prop({ type: Number })
  changeType: number;

  @Prop({ type: Object })
  oldValue: Record<string, any>;

  @Prop({ type: Object })
  newValue: Record<string, any>;

  @Prop({ type: Types.ObjectId, ref: 'users' })
  changedBy: Types.ObjectId;

  @Prop({ type: Number, default: RECORD_STATE.ACTIVE })
  recordState: number;
}

export const HistorySchema = SchemaFactory.createForClass(History);
