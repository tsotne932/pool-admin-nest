import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventService } from './events.service';
import { EventsController } from './events.controller';
import { Event, EventSchema } from '../schemas/event.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }])],
  providers: [EventService],
  controllers: [EventsController],
})
export class EventsModule {}
