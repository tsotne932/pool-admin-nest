import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { RECORD_STATE } from '../config/constants';
import { User } from './user.schema';

export type CardDocument = Card & Document;

@Schema({ timestamps: true })
export class Card {
  @Prop({ required: true })
  code: string;

  @Prop({ required: true, ref: 'User' })
  user: string;

  @Prop({ type: Date, default: () => { return new Date(); } })
  fromDate: Date;

  @Prop({ type: Date, default: () => { return new Date(32503665600000); } })
  toDate: Date;
}

export const CardSchema = SchemaFactory.createForClass(Card);
