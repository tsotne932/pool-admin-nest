import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { GroupService } from './groups.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('group')
@UseGuards(JwtAuthGuard)
export class GroupsController {
  constructor(private groupService: GroupService) { }

  @Post('find')
  async find(@Body() body: any) {
    try {
      return await this.groupService.findAll(body.data, body.paging);
    } catch (error: any) {
      return { error: error.message };
    }
  }

  @Post('findById')
  async findById(@Body() body: any) {
    try {
      return await this.groupService.findById(body.data);
    } catch (error: any) {
      return { error: error.message };
    }
  }

  @Post('add')
  async add(@Body() body: any) {
    try {
      return await this.groupService.create(body.data);
    } catch (error: any) {
      return { error: error.message };
    }
  }

  @Post('edit')
  async edit(@Body() body: any) {
    try {
      return await this.groupService.update(body.data._id, body.data);
    } catch (error: any) {
      return { error: error.message };
    }
  }
  @Post('delete')
  async delete(@Body() body: any) {
    try {
      return await this.groupService.delete(body.data);
    } catch (error: any) {
      return { error: error.message };
    }
  }
}
