import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GroupService } from './groups.service';
import { GroupsController } from './groups.controller';
import { Group, GroupSchema } from '../schemas/group.schema';
import { User, UserSchema } from '../schemas/user.schema';
import { Coach, CoachSchema } from 'src/schemas/coach.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Group.name, schema: GroupSchema },
      { name: User.name, schema: UserSchema },
      { name: Coach.name, schema: CoachSchema }
    ]),
  ],
  providers: [GroupService],
  controllers: [GroupsController],
})
export class GroupsModule { }
