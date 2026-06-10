import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GroupService } from './groups.service';
import { GroupsController } from './groups.controller';
import { Group, GroupSchema } from '../schemas/group.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Group.name, schema: GroupSchema }])],
  providers: [GroupService],
  controllers: [GroupsController],
})
export class GroupsModule {}
