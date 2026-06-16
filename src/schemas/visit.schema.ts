var mongoose = require('mongoose');

var visitSchema = new mongoose.Schema({
    card: {
        type: String,
        ref: 'cards'
    },
    user: { type: String, ref: 'users' },
    paymentKey: { type: String },
    pool: { type: String, ref: 'pool' },
    visitDate: { type: Date, default: () => { return new Date(); } }
});


visitSchema.statics.addVisit = async function (user, card, pool, paymentKey) {
    const newCard = new this({ user, card, pool, paymentKey });
    return await newCard.save();
};


import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { RECORD_STATE } from '../config/constants';

export type VisitDocument = Visit & Document;

@Schema({ timestamps: true })
export class Visit {

  @Prop({ required: true, ref: 'Card' })
  card: string;

  @Prop({ required: true, ref: 'User' })
  user: string;

  @Prop({ required: true, ref: 'Pool' })
  pool: string;

  @Prop({ required: true })
  paymentKey: string;

  @Prop({ default: () => new Date() })
  visitDate: Date;
}

export const VisitSchema = SchemaFactory.createForClass(Visit);
