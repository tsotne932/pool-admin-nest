import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PackageService } from './packages.service';
import { PackagesController } from './packages.controller';
import { Package, PackageSchema } from '../schemas/package.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Package.name, schema: PackageSchema }])],
  providers: [PackageService],
  controllers: [PackagesController],
})
export class PackagesModule {}
