import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { validate as uuidValidate } from 'uuid';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('favs')
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @Get()
  findAll() {
    return this.favoriteService.findAll();
  }

  @Post('track/:id')
  async addTrackToFavorite(@Param('id') id: string) {
    if (!uuidValidate(id)) {
      throw new HttpException('Invalid id', HttpStatus.BAD_REQUEST);
    }

    await this.favoriteService.addTrackToFavorite(id);
  }

  @Delete('track/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeTrackFromFavorite(@Param('id') id: string) {
    if (!uuidValidate(id)) {
      throw new HttpException('Invalid id', HttpStatus.BAD_REQUEST);
    }

    await this.favoriteService.removeTrackFromFavorite(id);
  }

  @Post('album/:id')
  async addAlbumToFavorite(@Param('id') id: string) {
    if (!uuidValidate(id)) {
      throw new HttpException('Invalid id', HttpStatus.BAD_REQUEST);
    }

    await this.favoriteService.addAlbumToFavorite(id);
  }

  @Delete('album/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeAlbumFromFavorite(@Param('id') id: string) {
    if (!uuidValidate(id)) {
      throw new HttpException('Invalid id', HttpStatus.BAD_REQUEST);
    }

    await this.favoriteService.removeAlbumFromFavorite(id);
  }

  @Post('artist/:id')
  async addArtistToFavorite(@Param('id') id: string) {
    if (!uuidValidate(id)) {
      throw new HttpException('Invalid id', HttpStatus.BAD_REQUEST);
    }

    await this.favoriteService.addArtistToFavorite(id);
  }

  @Delete('artist/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeArtistFromFavorite(@Param('id') id: string) {
    if (!uuidValidate(id)) {
      throw new HttpException('Invalid id', HttpStatus.BAD_REQUEST);
    }

    await this.favoriteService.removeArtistFromFavorite(id);
  }
}
