import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pool, PoolDocument } from '../schemas/pool.schema';

@Injectable()
export class PoolService {
  constructor(@InjectModel(Pool.name) private poolModel: Model<PoolDocument>) {}

  async findAll(data: any, paging: any) {
    const [pools, count] = await Promise.all([
      this.poolModel
        .find(data)
        .skip((paging.limit * paging.page) - paging.limit)
        .limit(paging.limit)
        .populate('group')
        .populate('package')
        .populate('coach')
        .exec(),
      this.poolModel.countDocuments(data).exec(),
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
