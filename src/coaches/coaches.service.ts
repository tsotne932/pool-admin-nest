import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as crypto from 'crypto';
import { Coach, CoachDocument } from '../schemas/coach.schema';
import { RECORD_STATE, USER_GROUPS } from '../config/constants';
import { User, UserDocument } from 'src/schemas/user.schema';
import { Pool, PoolDocument } from 'src/schemas/pool.schema';

@Injectable()
export class CoachService {
  constructor(@InjectModel(Coach.name) private coachModel: Model<CoachDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Pool.name) private poolModel: Model<PoolDocument>,
  ) {
  }

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


  async findUser(data: any, paging: any) {
    const searchQuery = {
      userGroupId: USER_GROUPS.USER,
      ...data,
    };

    if (data['pool.groups']) {
      delete searchQuery['pool.groups'];
    }

    let poolQuery = {};
    const existsPoolQuery = Object.keys(searchQuery).filter(key => key.startsWith('pool.'));
    if (existsPoolQuery.length) {
      existsPoolQuery.forEach(key => {
        const poolKey = key.replace('pool.', '');
        poolQuery[poolKey] = searchQuery[key];
        // searchQuery[`pool.${poolKey}`] = searchQuery[key];
        delete searchQuery[key];
      });
    }

    if (data['pool.coach']) {
      delete searchQuery['pool.coach'];

      const quer = { coach: data['pool.coach'] };

      if (data['pool.groups']) {
        quer['group'] = { $in: data['pool.groups'] };
      } else if (data['pool.group']) {
        quer['group'] = data['pool.group'];
      }
      const pools = await this.poolModel.find(quer).select('_id').exec();
      const poolIds = pools.map(pool => pool._id);
      searchQuery['pool'] = { $in: poolIds };
    }



    const [users, count] = await Promise.all([
      this.userModel
        .find(searchQuery)
        .populate('card')
        .populate({
          path: 'pool',
          populate: [
            { path: 'group', match: {} },
            { path: 'coach', match: { recordState: RECORD_STATE.ACTIVE } },
            { path: 'package', match: { recordState: RECORD_STATE.ACTIVE } },
          ],
        })
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
}
