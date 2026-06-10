import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { PackageService } from './packages.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('package')
@UseGuards(JwtAuthGuard)
export class PackagesController {
  constructor(private packageService: PackageService) { }

  @Post('findAll')
  async findAll() {
    try {
      return await this.packageService.findAll();
    } catch (error) {
      return { error: error.message };
    }
  }

  @Post('find')
  async find(@Body() body: any) {
    try {
      return await this.packageService.find(body.data, body.paging);
    } catch (error) {
      return { error: error.message };
    }
  }

  @Post('findById')
  async findById(@Body() body: any) {
    try {
      return await this.packageService.findById(body.data);
    } catch (error) {
      return { error: error.message };
    }
  }

  @Post('add')
  async add(@Body() body: any) {
    try {
      return await this.packageService.create(body.data);
    } catch (error) {
      return { error: error.message };
    }
  }

  @Post('edit')
  async edit(@Body() body: any) {
    try {
      return await this.packageService.update(body.data._id, body.data);
    } catch (error) {
      return { error: error.message };
    }
  }
}
