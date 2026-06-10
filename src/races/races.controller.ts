import { Controller, Post, Body } from '@nestjs/common';
import { RaceService } from './races.service';

@Controller('races')
export class RacesController {
  constructor(private raceService: RaceService) {}

  @Post('find')
  async find(@Body() body: any) {
    try {
      return await this.raceService.findAll(body.data, body.paging);
    } catch (error) {
      return { error: error.message };
    }
  }

  @Post('findById')
  async findById(@Body() body: any) {
    try {
      return await this.raceService.findById(body.data);
    } catch (error) {
      return { error: error.message };
    }
  }

  @Post('add')
  async add(@Body() body: any) {
    try {
      return await this.raceService.create(body.data);
    } catch (error) {
      return { error: error.message };
    }
  }

  @Post('edit')
  async edit(@Body() body: any) {
    try {
      return await this.raceService.update(body.data._id, body.data);
    } catch (error) {
      return { error: error.message };
    }
  }
}
