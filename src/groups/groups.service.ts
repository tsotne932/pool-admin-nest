import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Group, GroupDocument } from '../schemas/group.schema';
import { User, UserDocument } from '../schemas/user.schema';
import { RECORD_STATE } from '../config/constants';

@Injectable()
export class GroupService {
  constructor(
    @InjectModel(Group.name) private groupModel: Model<GroupDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) { }

  async findAll(data: any, paging: any) {
    const searchQuery = { recordState: RECORD_STATE.ACTIVE, ...data };
    if (!paging) {
      paging = { page: 1, limit: 100 };
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

    if (data?.parentId) {
      const parentGroup = await this.groupModel.findOne({ _id: new Types.ObjectId(data.parentId), recordState: RECORD_STATE.ACTIVE }).exec();
      if (!parentGroup) {
        throw new Error('Parent group not found');
      }
      let parentName = '';
      if (parentGroup.parentName) {
        parentName = `${parentGroup.parentName}/${parentGroup.name}`;
      } else {
        parentName = parentGroup.name;
      }
      newGroup.parentName = parentName;
    }
    return await newGroup.save();
  }

  async update(id: string, data: any) {
    return this.groupModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }


  async delete(data: any) {
    const groupId = data?.id || data?._id;
    if (!groupId || !Types.ObjectId.isValid(groupId)) {
      return { error: 'Invalid group id' };
    }

    const updateQuery = {
      recordState: RECORD_STATE.DELETED,
    };

    const toDelete = await this.groupModel
      .find({ parentId: groupId, recordState: RECORD_STATE.ACTIVE } as any)
      .exec();
    if (toDelete.length) {
      return { error: 'აღნიშნულ ჯგუფს აქვს შვილი ჯგუფ(ებ)ი' };
    }

    const users = await this.userModel
      .find({
        recordState: RECORD_STATE.ACTIVE,
        'pool.group': new Types.ObjectId(groupId),
        'pool.active': true,
      } as any)
      .exec();

    if (users.length) {
      const resString = `${users.length} მომხმარებელი კვლავ არის ამ ჯფუგის წევრი; შესაბამისად წაშლა ვერ განხორციელდება`;
      return { error: resString };
    }

    return await this.groupModel
      .updateMany(
        {
          $or: [{ _id: new Types.ObjectId(groupId) }, { parentId: groupId }],
        } as any,
        { $set: updateQuery },
      )
      .exec();
  }
}
