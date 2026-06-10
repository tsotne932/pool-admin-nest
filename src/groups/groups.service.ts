import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Group, GroupDocument } from '../schemas/group.schema';
import { RECORD_STATE } from '../config/constants';

@Injectable()
export class GroupService {
  constructor(@InjectModel(Group.name) private groupModel: Model<GroupDocument>) {}

  async findAll(data: any, paging: any) {
    const searchQuery = { recordState: RECORD_STATE.ACTIVE, ...data };
    if(!paging) {
      paging = { page: 1, limit: 10 };
    }
    const [groups, count] = await Promise.all([
      this.groupModel
        .find(searchQuery)
        .skip((paging.limit * paging.page) - paging.limit)
        .limit(paging.limit)
        .exec(),
      this.groupModel.countDocuments(searchQuery).exec(),
    ]);

    return { items: groups, totalItems: count };
  }

  async findById(query: any) {
    return this.groupModel.findOne(query).populate('pool').populate('coach').populate('members').exec();
  }

  async create(data: any) {
    const newGroup = new this.groupModel({
      ...data,
      recordState: RECORD_STATE.ACTIVE,
    });
    return await newGroup.save();
  }

  async update(id: string, data: any) {
    return this.groupModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }
}
