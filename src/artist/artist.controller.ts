import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  HttpException,
  HttpStatus,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { ArtistService } from './artist.service';
import { validate as uuidValidate } from 'uuid';
import { Artist } from './entities/artist.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('artist')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Get()
  findAll() {
    return this.artistService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    if (!uuidValidate(id)) {
      throw new HttpException('Invalid artist id', HttpStatus.BAD_REQUEST);
    }

    return this.artistService.findOne(id);
  }

  @Post()
  create(@Body() createArtistDto: Omit<Artist, 'id'>) {
    if (!createArtistDto.name || !createArtistDto.grammy) {
      throw new HttpException(
        'Required fields are not provided',
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.artistService.create(createArtistDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateArtistDto: Omit<Artist, 'id'>) {
    if (!uuidValidate(id)) {
      throw new HttpException('Invalid artist id', HttpStatus.BAD_REQUEST);
    }

    if (
      typeof updateArtistDto.name !== 'string' ||
      typeof updateArtistDto.grammy !== 'boolean'
    ) {
      throw new HttpException('Invalid artist body', HttpStatus.BAD_REQUEST);
    }

    return this.artistService.update(id, updateArtistDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    if (!uuidValidate(id)) {
      throw new HttpException('Invalid artist id', HttpStatus.BAD_REQUEST);
    }

    return this.artistService.remove(id);
  }
}
