import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { RECORD_STATE } from '../config/constants';

export type PackageDocument = Package & Document;

@Schema({ timestamps: true })
export class Package {
  @Prop({ required: true })
  name: string;

  @Prop()
  duration: string;

  @Prop()
  visitAmount: number;

  @Prop()
  price: string;

  @Prop({ type: Number, default: RECORD_STATE.ACTIVE })
  recordState: number;
}

export const PackageSchema = SchemaFactory.createForClass(Package);
