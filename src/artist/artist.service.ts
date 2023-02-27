import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Artist } from './entities/artist.entity';
import { TrackService } from '../track/track.service';
import { FavoriteService } from '../favorite/favorite.service';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class ArtistService {
  constructor(
    @Inject(forwardRef(() => TrackService))
    private trackService: TrackService,
    @Inject(forwardRef(() => FavoriteService))
    private favoriteService: FavoriteService,
    private prisma: PrismaService,
  ) {}

  async findAll() {
    return this.prisma.artist.findMany();
  }

  async findOne(id: string, customError?: boolean) {
    const artist = await this.prisma.artist.findUnique({ where: { id } });

    if (!artist && !customError) {
      throw new HttpException(
        'Artist with provided id is not found',
        HttpStatus.NOT_FOUND,
      );
    }

    return artist;
  }

  async findByIds(ids: string[]) {
    const artists = await this.findAll();
    return artists.filter((artist) => ids.includes(artist.id));
  }

  async create(createArtistDto: Omit<Artist, 'id'>) {
    return this.prisma.artist.create({
      data: createArtistDto,
    });
  }

  async update(id: string, updateArtistDto: Omit<Artist, 'id'>) {
    const artist = await this.prisma.artist.findUnique({ where: { id } });

    if (!artist) {
      throw new HttpException(
        'Artist with provided id is not found',
        HttpStatus.NOT_FOUND,
      );
    }

    return this.prisma.artist.update({
      data: {
        ...artist,
        ...updateArtistDto,
      },
      where: {
        id,
      },
    });
  }

  async remove(id: string) {
    const artist = await this.prisma.artist.findUnique({ where: { id } });

    if (!artist) {
      throw new HttpException(
        'Artist with provided id is not found',
        HttpStatus.NOT_FOUND,
      );
    }

    await this.favoriteService.removeArtistFromFavorite(id);
    await this.trackService.clearArtistTracks(id);
    await this.prisma.artist.delete({
      where: {
        id,
      },
    });
  }
}
