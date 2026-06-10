import { Controller, Post, Body } from '@nestjs/common';
import { EventService } from './events.service';

@Controller('events')
export class EventsController {
  constructor(private eventService: EventService) {}

  @Post('find')
  async find(@Body() body: any) {
    try {
      return await this.eventService.findAll(body.data, body.paging);
    } catch (error) {
      return { error: error.message };
    }
  }

  @Post('findById')
  async findById(@Body() body: any) {
    try {
      return await this.eventService.findById(body.data);
    } catch (error) {
      return { error: error.message };
    }
  }

  @Post('add')
  async add(@Body() body: any) {
    try {
      return await this.eventService.create(body.data);
    } catch (error) {
      return { error: error.message };
    }
  }

  @Post('edit')
  async edit(@Body() body: any) {
    try {
      return await this.eventService.update(body.data._id, body.data);
    } catch (error) {
      return { error: error.message };
    }
  }
}
