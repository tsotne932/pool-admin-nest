import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { CoachService } from './coaches.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('coach')
@UseGuards(JwtAuthGuard)
export class CoachesController {
  constructor(private coachService: CoachService) {}

  @Post('find')
  async find(@Body() body: any) {
    try {
      return await this.coachService.findAll(body.data, body.paging);
    } catch (error) {
      return { error: error.message };
    }
  }

  @Post('findById')
  async findById(@Body() body: any) {
    try {
      return await this.coachService.findById(body.data);
    } catch (error) {
      return { error: error.message };
    }
  }

  @Post('add')
  async add(@Body() body: any) {
    try {
      return await this.coachService.create(body.data);
    } catch (error) {
      return { error: error.message };
    }
  }

  @Post('edit')
  async edit(@Body() body: any) {
    try {
      return await this.coachService.update(body.data._id, body.data);
    } catch (error) {
      return { error: error.message };
    }
  }

  @Post('delete/:id')
  async delete(@Param('id') id: string) {
    try {
      return await this.coachService.delete(id);
    } catch (error) {
      return { error: error.message };
    }
  }
}
