import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Coach, CoachDocument } from '../schemas/coach.schema';
import { RECORD_STATE } from '../config/constants';

@Injectable()
export class CoachService {
  constructor(@InjectModel(Coach.name) private coachModel: Model<CoachDocument>) {}

  async findAll(data: any, paging: any) {
    const searchQuery = { recordState: RECORD_STATE.ACTIVE, ...data };
    if(!paging){
      paging = { page: 1, limit: 10 };
    }
    const [coaches, count] = await Promise.all([
      this.coachModel
        .find(searchQuery)
        .skip((paging.limit * paging.page) - paging.limit)
        .limit(paging.limit)
        .exec(),
      this.coachModel.countDocuments(searchQuery).exec(),
    ]);

    return { items: coaches, totalItems: count };
  }

  async findById(query: any) {
    return this.coachModel.findOne(query).populate('pool').populate('groups').exec();
  }

  async create(data: any) {
    const newCoach = new this.coachModel({
      ...data,
      recordState: RECORD_STATE.ACTIVE,
    });
    return await newCoach.save();
  }

  async update(id: string, data: any) {
    return this.coachModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async delete(id: string) {
    return this.coachModel.findByIdAndUpdate(id, { recordState: RECORD_STATE.DELETED }, { new: true }).exec();
  }
}
