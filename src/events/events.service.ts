import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event, EventDocument } from '../schemas/event.schema';
import { RECORD_STATE } from '../config/constants';

@Injectable()
export class EventService {
  constructor(@InjectModel(Event.name) private eventModel: Model<EventDocument>) {}

  async findAll(data: any, paging: any) {
    const searchQuery = { recordState: RECORD_STATE.ACTIVE, ...data };

    const [events, count] = await Promise.all([
      this.eventModel
        .find(searchQuery)
        .skip((paging.limit * paging.page) - paging.limit)
        .limit(paging.limit)
        .exec(),
      this.eventModel.countDocuments(searchQuery).exec(),
    ]);

    return { items: events, totalItems: count };
  }

  async findById(query: any) {
    return this.eventModel.findOne(query).populate('pool').populate('participants').exec();
  }

  async create(data: any) {
    const newEvent = new this.eventModel({
      ...data,
      recordState: RECORD_STATE.ACTIVE,
    });
    return await newEvent.save();
  }

  async update(id: string, data: any) {
    return this.eventModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }
}
