import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { RECORD_STATE } from '../config/constants';

export type GroupDocument = Group & Document;

@Schema({ timestamps: true })
export class Group {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ type: Types.ObjectId, ref: 'pool' })
  pool: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'coaches' })
  coach: Types.ObjectId;

  @Prop({ type: [Types.ObjectId], ref: 'users' })
  members: Types.ObjectId[];

  @Prop({ type: Number, default: RECORD_STATE.ACTIVE })
  recordState: number;

  @Prop({ type: [Object] })
  history: Record<string, any>[];
}

export const GroupSchema = SchemaFactory.createForClass(Group);
