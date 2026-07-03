import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pool, PoolDocument } from '../schemas/pool.schema';

@Injectable()
export class PoolService {
  constructor(@InjectModel(Pool.name) private poolModel: Model<PoolDocument>) { }

  async findAll(data: any, paging: any) {

    const query = { ...data };
    query.startDate = { $gte: new Date(2026, 6, 1) };

    if (query['startDateFrom']) {
      query['startDate'] = { $gte: new Date(query['startDateFrom']) };
      delete query['startDateFrom'];
    }
    if (query['startDateTo']) {
      query['startDate'] = { ...query['startDate'], $lte: new Date(query['startDateTo']) };
      delete query['startDateTo'];
    }
    if (query['endDateFrom']) {
      query['endDate'] = { $gte: new Date(query['endDateFrom']) };
      delete query['endDateFrom'];
    }
    if (query['endDateTo']) {
      query['endDate'] = { ...query['endDate'], $lte: new Date(query['endDateTo']) };
      delete query['endDateTo'];
    }
    // query['fromDate'] = { $lte: new Date() };
    // query['toDate'] = { $gte: new Date() };
    const pipeline: any[] = [
      { $match: query },
      {
        $addFields: {
          group: { $convert: { input: '$group', to: 'objectId', onError: '$group', onNull: null } },
          package: { $convert: { input: '$package', to: 'objectId', onError: '$package', onNull: null } },
          coach: { $convert: { input: '$coach', to: 'objectId', onError: '$coach', onNull: null } },
          user: { $convert: { input: '$user', to: 'objectId', onError: '$user', onNull: null } },
        },
      },
      { $lookup: { from: 'groups', localField: 'group', foreignField: '_id', as: 'group' } },
      { $unwind: { path: '$group', preserveNullAndEmptyArrays: true } },
      { $lookup: { from: 'users', localField: 'user', foreignField: '_id', as: 'user', pipeline: [{ $match: { recordState: 1 } }] } },
      { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
      { $lookup: { from: 'packages', localField: 'package', foreignField: '_id', as: 'package', pipeline: [{ $match: { recordState: 1 } }] } },
      { $unwind: { path: '$package', preserveNullAndEmptyArrays: true } },
      { $lookup: { from: 'coaches', localField: 'coach', foreignField: '_id', as: 'coach', pipeline: [{ $match: { recordState: 1 } }] } },
      { $unwind: { path: '$coach', preserveNullAndEmptyArrays: true } },
      { $sort: { startDate: -1 } },
      {
        $facet: {
          items: [
            { $skip: (paging.limit * paging.page) - paging.limit },
            { $limit: paging.limit }
          ],
          count: [{ $count: 'total' }]
        }
      }
    ];

    const [result] = await this.poolModel.aggregate(pipeline as any).exec();
    const pools = result.items;
    const count = result.count[0]?.total || 0;

    return { items: pools, totalItems: count };
  }

  async findById(query: any) {
    return this.poolModel.findOne(query).populate('group').populate('package').populate('coach').exec();
  }

  async create(data: any) {
    const newPool = new this.poolModel(data);
    return await newPool.save();
  }

  async update(id: string, data: any) {
    return this.poolModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }
}
