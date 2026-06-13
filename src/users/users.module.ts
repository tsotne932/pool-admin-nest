import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './users.service';
import { UsersController } from './users.controller';
import { User, UserSchema } from '../schemas/user.schema';
import { Pool, PoolSchema } from '../schemas/pool.schema';
import { History, HistorySchema } from '../schemas/history.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Pool.name, schema: PoolSchema },
      { name: History.name, schema: HistorySchema },
    ]),
  ],
  providers: [UserService],
  controllers: [UsersController],
})
export class UsersModule {}
