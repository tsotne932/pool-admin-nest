import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Race, RaceDocument } from '../schemas/race.schema';
import { RECORD_STATE } from '../config/constants';

@Injectable()
export class RaceService {
  constructor(@InjectModel(Race.name) private raceModel: Model<RaceDocument>) {}

  async findAll(data: any, paging: any) {
    const searchQuery = { recordState: RECORD_STATE.ACTIVE, ...data };

    const [races, count] = await Promise.all([
      this.raceModel
        .find(searchQuery)
        .skip((paging.limit * paging.page) - paging.limit)
        .limit(paging.limit)
        .exec(),
      this.raceModel.countDocuments(searchQuery).exec(),
    ]);

    return { items: races, totalItems: count };
  }

  async findById(query: any) {
    return this.raceModel.findOne(query).exec();
  }

  async create(data: any) {
    const newRace = new this.raceModel({
      ...data,
      recordState: RECORD_STATE.ACTIVE,
    });
    return await newRace.save();
  }

  async update(id: string, data: any) {
    return this.raceModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }
}
