import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CoachService } from './coaches.service';
import { CoachesController } from './coaches.controller';
import { Coach, CoachSchema } from '../schemas/coach.schema';
import { User, UserSchema } from 'src/schemas/user.schema';
import { Pool, PoolSchema } from 'src/schemas/pool.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Coach.name, schema: CoachSchema },
    { name: User.name, schema: UserSchema },
    { name: Pool.name, schema: PoolSchema }])],
  providers: [CoachService],
  controllers: [CoachesController],
})
export class CoachesModule { }
