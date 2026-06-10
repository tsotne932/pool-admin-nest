import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RaceService } from './races.service';
import { RacesController } from './races.controller';
import { Race, RaceSchema } from '../schemas/race.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Race.name, schema: RaceSchema }])],
  providers: [RaceService],
  controllers: [RacesController],
})
export class RacesModule {}
