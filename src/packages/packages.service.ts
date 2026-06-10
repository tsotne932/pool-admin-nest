import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Package, PackageDocument } from '../schemas/package.schema';
import { RECORD_STATE } from '../config/constants';

@Injectable()
export class PackageService {
  constructor(@InjectModel(Package.name) private packageModel: Model<PackageDocument>) {}

  async find(data: any, paging: any) {
    const searchQuery = { recordState: RECORD_STATE.ACTIVE, ...data };

    const [packages, count] = await Promise.all([
      this.packageModel
        .find(searchQuery)
        .skip((paging.limit * paging.page) - paging.limit)
        .limit(paging.limit)
        .exec(),
      this.packageModel.countDocuments(searchQuery).exec(),
    ]);

    return { items: packages, totalItems: count };
  }

  async findAll() {
    return this.packageModel.find({ recordState: RECORD_STATE.ACTIVE }).exec();
  }

  async findById(query: any) {
    return this.packageModel.findOne(query).exec();
  }

  async create(data: any) {
    const newPackage = new this.packageModel({
      ...data,
      recordState: RECORD_STATE.ACTIVE,
    });
    return await newPackage.save();
  }

  async update(id: string, data: any) {
    return this.packageModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }
}
