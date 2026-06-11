import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Coach, CoachDocument } from '../schemas/coach.schema';
import { RECORD_STATE, USER_GROUPS } from '../config/constants';

@Injectable()
export class CoachService {
  constructor(@InjectModel(Coach.name) private coachModel: Model<CoachDocument>) { }

  async findAll(data: any, paging: any) {
    const searchQuery = { recordState: RECORD_STATE.ACTIVE, ...data };
    if (!paging) {
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

  async findByCoach(data: any) {
    const coachId = data?.coachId;
    if (!coachId || !Types.ObjectId.isValid(coachId)) {
      return [];
    }

    const coach = await this.coachModel
      .findOne({ recordState: RECORD_STATE.ACTIVE, _id: new Types.ObjectId(coachId) })
      .populate({
        path: 'pool.groups',
        match: { recordState: RECORD_STATE.ACTIVE },
        populate: {
          path: 'parentId',
          match: { recordState: RECORD_STATE.ACTIVE },
        },
      })
      .populate({
        path: 'groups',
        match: { recordState: RECORD_STATE.ACTIVE },
        populate: {
          path: 'parentId',
          match: { recordState: RECORD_STATE.ACTIVE },
        },
      })
      .exec();

    const poolGroups = (coach as any)?.pool?.groups;
    if (Array.isArray(poolGroups) && poolGroups.length) {
      return poolGroups;
    }

    const coachGroups = (coach as any)?.groups;
    if (Array.isArray(coachGroups) && coachGroups.length) {
      return coachGroups;
    }

    return [];
  }

  async create(data: any) {
    const newCoach = new this.coachModel({
      userName: data.profile.pid,
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
}
