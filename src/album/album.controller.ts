import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  HttpCode,
  HttpStatus,
  HttpException, UseGuards,
} from '@nestjs/common';
import { AlbumService } from './album.service';
import { Album } from './entities/album.entity';
import { validate as uuidValidate } from 'uuid';
import {JwtAuthGuard} from "../auth/jwt-auth.guard";

@UseGuards(JwtAuthGuard)
@Controller('album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Get()
  findAll() {
    return this.albumService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    if (!uuidValidate(id)) {
      throw new HttpException('Invalid album id', HttpStatus.BAD_REQUEST);
    }

    return this.albumService.findOne(id);
  }

  @Post()
  create(@Body() createAlbumDto: Omit<Album, 'id'>) {
    if (
      typeof createAlbumDto.name !== 'string' ||
      typeof createAlbumDto.year !== 'number'
    ) {
      throw new HttpException('Invalid album body', HttpStatus.BAD_REQUEST);
    }

    return this.albumService.create(createAlbumDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateAlbumDto: Omit<Album, 'id'>) {
    if (!uuidValidate(id)) {
      throw new HttpException('Invalid album id', HttpStatus.BAD_REQUEST);
    }

    if (
      typeof updateAlbumDto.name !== 'string' ||
      typeof updateAlbumDto.year !== 'number'
    ) {
      throw new HttpException('Invalid album body', HttpStatus.BAD_REQUEST);
    }

    return this.albumService.update(id, updateAlbumDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    if (!uuidValidate(id)) {
      throw new HttpException('Invalid album id', HttpStatus.BAD_REQUEST);
    }

    return this.albumService.remove(id);
  }
}
