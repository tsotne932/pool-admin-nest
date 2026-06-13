import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as crypto from 'crypto';
import { Coach, CoachDocument } from '../schemas/coach.schema';
import { RECORD_STATE, USER_GROUPS } from '../config/constants';

@Injectable()
export class CoachService {
  constructor(@InjectModel(Coach.name) private coachModel: Model<CoachDocument>) { }

  async findAll(data: any, paging: any) {
    const searchQuery = { recordState: RECORD_STATE.ACTIVE, ...data };
    if (!paging) {
      paging = { page: 1, limit: 100 };
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
    return this.coachModel.findOne(query).populate('pool').exec();
  }


  async create(data: any) {
    const defaultPassword = (data?.profile?.pid || data?.userName || '').toString();
    const newCoach = new this.coachModel({
      userName: data.profile.pid,
      password: this.hashPassword(defaultPassword),
      profile: data.profile,
      contact: data.contact,
      pool: data.pool,
      isVerified: true,
      userGroupId: USER_GROUPS.COACH,
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

  public hashPassword(password: string): string {
    return crypto.createHash('md5').update(password).digest('hex');
  }
}
