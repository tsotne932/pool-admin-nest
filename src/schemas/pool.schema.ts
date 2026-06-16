import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PoolDocument = Pool & Document;

@Schema({ timestamps: true })
export class Pool {
  @Prop({ type: Types.ObjectId, ref: 'Group' })
  group: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Package' })
  package: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Coach' })
  coach: Types.ObjectId;

  @Prop()
  startDate: string;

  @Prop({ type: String, default: new Date(32503665600000).toISOString() })
  endDate: string;

  @Prop({ type: Boolean, default: false })
  active: boolean;

  @Prop({ type: Number, default: 0 })
  visited: number;

  @Prop({ type: String, default: () => new Date().getTime().toString() })
  paymentKey: string;

  @Prop({ type: Types.ObjectId, ref: 'users' })
  user: Types.ObjectId;

  @Prop({ type: Date, default: () => new Date() })
  fromDate: Date;

  @Prop({ type: Date, default: () => new Date(32503665600000) })
  toDate: Date;
}

export const PoolSchema = SchemaFactory.createForClass(Pool);
