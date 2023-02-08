import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  Put,
  HttpCode,
} from '@nestjs/common';
import { TrackService } from './track.service';
import { Track } from './entities/track.entity';
import { validate as uuidValidate } from 'uuid';

@Controller('track')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Get()
  findAll() {
    return this.trackService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    if (!uuidValidate(id)) {
      throw new HttpException('Invalid track id', HttpStatus.BAD_REQUEST);
    }
    return this.trackService.findOne(id);
  }

  @Post()
  create(@Body() track: Track) {
    if (!track.name || !track.duration) {
      throw new HttpException(
        'Required fields are not provided',
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.trackService.create(track);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateTrackDto: Partial<Track>) {
    if (!uuidValidate(id)) {
      throw new HttpException('Invalid track id', HttpStatus.BAD_REQUEST);
    }

    if (!updateTrackDto.name || !updateTrackDto.duration) {
      throw new HttpException(
        'Required fields are not provided',
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.trackService.update(id, updateTrackDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    if (!uuidValidate(id)) {
      throw new HttpException('Invalid track id', HttpStatus.BAD_REQUEST);
    }

    return this.trackService.remove(id);
  }
}
