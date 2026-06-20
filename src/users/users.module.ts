import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './users.service';
import { UsersController } from './users.controller';
import { User, UserSchema } from '../schemas/user.schema';
import { Pool, PoolSchema } from '../schemas/pool.schema';
import { History, HistorySchema } from '../schemas/history.schema';
import { Card, CardSchema } from 'src/schemas/card.schema';
import { Visit, VisitSchema } from 'src/schemas/visit.schema';
import { Coach, CoachSchema } from 'src/schemas/coach.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Pool.name, schema: PoolSchema },
      { name: History.name, schema: HistorySchema },
      { name: Card.name, schema: CardSchema },
      { name: Visit.name, schema: VisitSchema }
    ]),
  ],
  providers: [UserService],
  controllers: [UsersController],
})
export class UsersModule { }
