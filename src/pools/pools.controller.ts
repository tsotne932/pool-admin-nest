import { Controller, Post, Body } from '@nestjs/common';
import { PoolService } from './pools.service';

@Controller('pools')
export class PoolsController {
  constructor(private poolService: PoolService) {}

  @Post('find')
  async find(@Body() body: any) {
    try {
      return await this.poolService.findAll(body.data, body.paging);
    } catch (error) {
      return { error: error.message };
    }
  }

  @Post('findById')
  async findById(@Body() body: any) {
    try {
      return await this.poolService.findById(body.data);
    } catch (error) {
      return { error: error.message };
    }
  }

  @Post('add')
  async add(@Body() body: any) {
    try {
      return await this.poolService.create(body.data);
    } catch (error) {
      return { error: error.message };
    }
  }

  @Post('edit')
  async edit(@Body() body: any) {
    try {
      return await this.poolService.update(body.data._id, body.data);
    } catch (error) {
      return { error: error.message };
    }
  }
}
