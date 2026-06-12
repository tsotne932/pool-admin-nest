import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { RECORD_STATE } from '../config/constants';

export type GroupDocument = Group & Document;

@Schema({ timestamps: true })
export class Group {
  @Prop({})
  parentName: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  parentId: string;

  @Prop({ type: Number, default: RECORD_STATE.ACTIVE })
  recordState: number;
}

export const GroupSchema = SchemaFactory.createForClass(Group);
