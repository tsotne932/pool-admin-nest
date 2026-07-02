import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pool, PoolDocument } from '../schemas/pool.schema';

@Injectable()
export class PoolService {
  constructor(@InjectModel(Pool.name) private poolModel: Model<PoolDocument>) { }

  async findAll(data: any, paging: any) {

    const query = { ...data };


    if (query['startDateFrom']) {
      query['startDate'] = { $gte: new Date(query['startDateFrom']).getTime() };
      delete query['startDateFrom'];
    }
    if (query['startDateTo']) {
      query['startDate'] = { ...query['startDate'], $lte: new Date(query['startDateTo']).getTime() };
      delete query['startDateTo'];
    }
    if (query['endDateFrom']) {
      query['endDate'] = { $gte: new Date(query['endDateFrom']).getTime() };
      delete query['endDateFrom'];
    }
    if (query['endDateTo']) {
      query['endDate'] = { ...query['endDate'], $lte: new Date(query['endDateTo']).getTime() };
      delete query['endDateTo'];
    }
    query['fromDate'] = { $lte: new Date().getTime() };
    query['toDate'] = { $gte: new Date().getTime() };
    const [pools, count] = await Promise.all([
      this.poolModel
        .find(query)
        .skip((paging.limit * paging.page) - paging.limit)
        .limit(paging.limit)
        .populate('group')
        .populate({ path: 'user', match: { recordState: 1 } })
        .populate('package')
        .populate('coach')
        .exec(),
      this.poolModel.countDocuments(query).exec(),
    ]);

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
