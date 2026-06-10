import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { RECORD_STATE, USER_GROUPS } from '../config/constants';
import * as crypto from 'crypto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findAll(data: any, paging: any) {
    const searchQuery = {
      userGroupId: USER_GROUPS.USER,
      ...data,
    };

    const [users, count] = await Promise.all([
      this.userModel
        .find(searchQuery)
        .skip((paging.limit * paging.page) - paging.limit)
        .limit(paging.limit)
        .exec(),
      this.userModel.countDocuments(searchQuery).exec(),
    ]);

    return {
      items: users,
      totalItems: count,
    };
  }

  async findById(query: any) {
    return this.userModel
      .findOne(query)
      .populate('card', 'code')
      .populate('pool')
      .exec();
  }

  async findByIdWithPopulation(query: any) {
    return this.userModel
      .findOne(query)
      .populate({
        path: 'pool',
        populate: [
          { path: 'group', match: { recordState: RECORD_STATE.ACTIVE } },
          { path: 'coach', match: { recordState: RECORD_STATE.ACTIVE } },
          { path: 'package', match: { recordState: RECORD_STATE.ACTIVE } },
        ],
      })
      .exec();
  }

  async create(data: any) {
    const existingUser = await this.userModel
      .findOne({ 'profile.pid': data.profile.pid })
      .exec();
    
    if (existingUser) {
      throw new Error('PID Exists!');
    }

    const newUser = new this.userModel({
      userName: data.profile.pid,
      profile: data.profile,
      contact: data.contact,
      isVerified: true,
      userGroupId: USER_GROUPS.USER,
      recordState: RECORD_STATE.ACTIVE,
      password: this.hashPassword(data.profile.pid.toString()),
    });

    return await newUser.save();
  }

  async update(userId: string, updateData: any) {
    const user = await this.userModel.findOne({ _id: userId }).exec();
    
    if (!user) {
      throw new Error('User not found');
    }

    const updateQuery: any = {};

    if (updateData.profile && Object.keys(updateData.profile).length) {
      updateQuery.profile = updateData.profile;
    }

    if (updateData.contact && Object.keys(updateData.contact).length) {
      updateQuery.contact = updateData.contact;
    }

    if (updateData.userGroupId) {
      updateQuery.userGroupId = updateData.userGroupId;
    }

    if (updateData.recordState !== undefined) {
      updateQuery.recordState = updateData.recordState;
    }

    if (Object.keys(updateQuery).length === 0) {
      return { result: 'Nothing Changed' };
    }

    return await this.userModel
      .findOneAndUpdate(
        { _id: userId },
        { $set: updateQuery },
        { new: true },
      )
      .populate({
        path: 'pool',
        populate: [
          { path: 'group', match: { recordState: RECORD_STATE.ACTIVE } },
          { path: 'coach', match: { recordState: RECORD_STATE.ACTIVE } },
          { path: 'package', match: { recordState: RECORD_STATE.ACTIVE } },
        ],
      })
      .exec();
  }

  private hashPassword(password: string): string {
    return crypto.createHash('md5').update(password).digest('hex');
  }
}
