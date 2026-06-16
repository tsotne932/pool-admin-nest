import { Controller, Post, Body, Get } from '@nestjs/common';
import { UserService } from './users.service';

@Controller('user')
export class UsersController {
  constructor(private userService: UserService) { }

  @Post('find')
  async find(@Body() body: any) {
    try {
      return await this.userService.findAll(body.data, body.paging);
    } catch (error: any) {
      return { error: error.message };
    }
  }

  @Post('findById')
  async findById(@Body() body: any) {
    try {
      return await this.userService.findById(body.data);
    } catch (error: any) {
      return { error: error.message };
    }
  }

  @Post('findById/population')
  async findByIdWithPopulation(@Body() body: any) {
    try {
      return await this.userService.findByIdWithPopulation(body.data);
    } catch (error: any) {
      return { error: error.message };
    }
  }

  @Post('add')
  async add(@Body() body: any) {
    try {
      return await this.userService.create(body.data);
    } catch (error: any) {
      return { error: error.message };
    }
  }

  @Post('edit')
  async edit(@Body() body: any) {
    try {
      return await this.userService.update(body.data._id, body.data, body.action);
    } catch (error: any) {
      return { error: error.message };
    }
  }
  @Post('findByCode')
  async findByCode(@Body() body: any) {
    try {
      return await this.userService.findByCode(body.data);
    } catch (error: any) {
      return { error: error.message };
    }
  }

  @Post('letsGoSwimming')
  async letsGoSwimming(@Body() body: any) {
    try {
      return await this.userService.letsGoSwimming(body.data);
    } catch (error: any) {
      return { error: error.message };
    }
  }
}
