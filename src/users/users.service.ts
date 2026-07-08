import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { History, HistoryDocument } from '../schemas/history.schema';
import { Pool, PoolDocument } from '../schemas/pool.schema';
import { HISTORY, RECORD_STATE, USER_GROUPS } from '../config/constants';
import * as crypto from 'crypto';
import { Card, CardDocument } from 'src/schemas/card.schema';
import { Visit, VisitDocument } from 'src/schemas/visit.schema';
import { Coach, CoachDocument } from 'src/schemas/coach.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Pool.name) private poolModel: Model<PoolDocument>,
    @InjectModel(History.name) private historyModel: Model<HistoryDocument>,
    @InjectModel(Card.name) private cardModel: Model<CardDocument>,
    @InjectModel(Visit.name) private visitModel: Model<VisitDocument>
  ) { }

  async findAll(data: any, paging: any) {
    const searchQuery = {
      userGroupId: USER_GROUPS.USER,
      ...data,
    };
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
    if (data['pool.group']) {
      delete searchQuery['pool.group'];
    }

    if (data['pool.coach']) {
      delete searchQuery['pool.coach'];

      const quer = { coach: data['pool.coach'] };

      if (data['pool.group']) {
        quer['group'] = data['pool.group'];
      }
      const pools = await this.poolModel.find(quer).select('_id').exec();
      const poolIds = pools.map(pool => pool._id);
      searchQuery['pool'] = { $in: poolIds };
    }


    if (searchQuery['firstName']) {
      searchQuery['firstName'] = { $regex: searchQuery['firstName'], $options: 'i' };
    } else if (searchQuery['lastName']) {
      searchQuery['lastName'] = { $regex: searchQuery['lastName'], $options: 'i' };
    }

    const [users, count] = await Promise.all([
      this.userModel
        .find(searchQuery)
        .populate('card')
        .populate({
          path: 'pool',
          populate: [
            { path: 'group', match: { recordState: RECORD_STATE.ACTIVE, ...poolQuery } },
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
      userGroupId: USER_GROUPS.USER,
      recordState: RECORD_STATE.ACTIVE,
      password: this.hashPassword(data.profile.pid.toString()),
    });

    return await newUser.save();
  }

  async update(userId: string, updateData: any, action?: any) {
    const isPackageEdit = !!action?.isPackageEdit;
    const changeType = action?.changeType;

    if (!userId) {
      return { error: '_id Required' };
    }

    const userFound = await this.userModel.findOne({ _id: userId }).exec();
    if (!userFound) {
      return { error: 'User not Found!' };
    }

    const updateQuery: any = {};

    if (updateData.profile && Object.keys(updateData.profile).length) {
      updateQuery.profile = updateData.profile;
    }

    if (updateData.contact && Object.keys(updateData.contact).length) {
      updateQuery.contact = updateData.contact;
    }

    if (updateData.pool && Object.keys(updateData.pool).length) {

      const existingPool = await this.poolModel.findById(userFound.pool).exec();
      if (existingPool) {
        const existingPoolEndDate = existingPool.endDate.toLocaleDateString('en-CA');
        const existingPollStartDate = existingPool.startDate.toLocaleDateString('en-CA');
        const newPoolStartDate = new Date(updateData.pool.startDate).toLocaleDateString('en-CA');
        const newPoolEndDate = new Date(updateData.pool.endDate).toLocaleDateString('en-CA');

        if (existingPoolEndDate !== newPoolEndDate && existingPollStartDate !== newPoolStartDate) {
          const pool = await this.poolModel.create({
            ...updateData.pool,
            visited: 0,
            paymentKey: new Date().getTime().toString(),
            user: new Types.ObjectId(userId),
          });
          updateQuery.pool = pool._id;

          existingPool.toDate = new Date();
          existingPool.active = false;
          await existingPool.save();
        } else {
          existingPool.updateOne({
            ...updateData.pool,
          }).exec();
        }
      } else {
        const pool = await this.poolModel.create({
          ...updateData.pool,
          user: new Types.ObjectId(userId),
        });
        updateQuery.pool = pool._id;
      }

    }

    if (updateData.card && Object.keys(updateData.card).length && updateData.card.code) {
      const exists = await this.cardModel.exists({
        code: updateData.card.code,
        user: userId
      });
      if (!exists) {
        const cardResult = await new this.cardModel({
          code: updateData.card.code,
          user: new Types.ObjectId(userId),
          createdAt: new Date(),
          updatedAt: new Date(),
        }).save();
        updateQuery.card = cardResult._id;
      }
    }

    if (updateData.userGroupId) {
      updateQuery.userGroupId = updateData.userGroupId;
    }

    if (updateData.recordState !== undefined) {
      updateQuery.recordState = updateData.recordState;
    }

    if (updateData.isVerified) {
      updateQuery.isVerified = updateData.isVerified;
    }

    if (Object.keys(updateQuery).length === 0) {
      return { result: 'Nothing Changed' };
    }

    await this.userModel
      .findOneAndUpdate(
        { _id: userId },
        { $set: updateQuery },
        { new: false },
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

    await this.historyModel.create({
      dataId: userFound._id,
      dataType: HISTORY.DATA_TYPE.USER,
      changeType: isPackageEdit ? changeType : HISTORY.CHANGE_TYPE.USER_INFO,
      oldValue: userFound,
      newValue: updateQuery,
      changedBy: null,
      recordState: RECORD_STATE.ACTIVE,
    });

    return userFound;
  }

  private hashPassword(password: string): string {
    return crypto.createHash('md5').update(password).digest('hex');
  }

  async findByCode(data: any) {
    const card = await this.cardModel.findOne({ code: data.code }).populate({ path: 'user', populate: { path: 'pool', populate: { path: 'package' } } });
    return card ? card.user : null;
  }

  async letsGoSwimming(data: any) {
    let code = data.code;
    if (!code) return { error: "Code Required" };

    const cardUser = await this.cardModel.findOne({ code: data.code });
    if (!cardUser) throw { message: "Card Not Found" };


    const user = await this.userModel.findOne({ _id: cardUser.user })
    const card = await this.cardModel.findOne({ _id: cardUser._id });
    const pool = await this.poolModel.findOne({ _id: user.pool });

    const lastUserVisit = await this.visitModel.findOne({ user: cardUser._id.toString(), paymentKey: pool.paymentKey }).sort({ visitDate: -1 }).exec();
    if (lastUserVisit && (new Date(lastUserVisit.visitDate).getTime() > new Date(new Date().setHours(new Date().getHours() - 1)).getTime())) {
      throw { message: "User has already visited within the last hour" };
    }

    const newVisit = new this.visitModel({ user: cardUser._id.toString(), card: card._id, pool: pool._id, paymentKey: pool.paymentKey });
    await newVisit.save();
    const totalVisits = await this.visitModel.countDocuments({ user: cardUser._id.toString(), paymentKey: pool.paymentKey }).exec();
    await this.poolModel.updateOne({ _id: pool._id }, { $set: { visited: totalVisits } }).exec();
    return cardUser;

  }
}
