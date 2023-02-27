import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Album } from './entities/album.entity';
import { TrackService } from '../track/track.service';
import { FavoriteService } from '../favorite/favorite.service';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class AlbumService {
  constructor(
    @Inject(forwardRef(() => TrackService))
    private trackService: TrackService,
    @Inject(forwardRef(() => FavoriteService))
    private favoriteService: FavoriteService,
    private prisma: PrismaService,
  ) {}

  async findAll() {
    return this.prisma.album.findMany();
  }

  async findOne(id: string, customError?: boolean) {
    const album = await this.prisma.album.findUnique({ where: { id } });

    if (!album && !customError) {
      throw new HttpException(
        'Album with provided id is not found',
        HttpStatus.NOT_FOUND,
      );
    }

    return album;
  }

  async create(createAlbumDto: Omit<Album, 'id'>) {
    return this.prisma.album.create({
      data: createAlbumDto,
    });
  }

  async update(id: string, updateAlbumDto: Omit<Album, 'id'>) {
    const album = await this.prisma.album.findUnique({ where: { id } });

    if (!album) {
      throw new HttpException(
        'Album with provided id is not found',
        HttpStatus.NOT_FOUND,
      );
    }

    return this.prisma.album.update({
      data: {
        ...album,
        ...updateAlbumDto,
      },
      where: {
        id,
      },
    });
  }

  async remove(id: string) {
    const album = await this.prisma.album.findUnique({ where: { id } });

    if (!album) {
      throw new HttpException(
        'Album with provided id is not found',
        HttpStatus.NOT_FOUND,
      );
    }

    await this.trackService.clearAlbumTracks(id);
    await this.favoriteService.removeAlbumFromFavorite(id);
    await this.prisma.album.delete({
      where: {
        id,
      },
    });
  }
}
