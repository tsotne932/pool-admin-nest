import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PoolService } from './pools.service';
import { PoolsController } from './pools.controller';
import { Pool, PoolSchema } from '../schemas/pool.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Pool.name, schema: PoolSchema }])],
  providers: [PoolService],
  controllers: [PoolsController],
})
export class PoolsModule {}
