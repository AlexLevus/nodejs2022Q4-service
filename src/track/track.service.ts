import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './entities/track.entity';
import { FavoriteService } from '../favorite/favorite.service';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class TrackService {
  constructor(
    @Inject(forwardRef(() => FavoriteService))
    private favoriteService: FavoriteService,
    private prisma: PrismaService,
  ) {}

  async findAll() {
    return this.prisma.track.findMany();
  }

  async findOne(id: string, customError?: boolean) {
    const track = await this.prisma.track.findUnique({ where: { id } });

    if (!track && !customError) {
      throw new HttpException(
        'Track with provided id is not found',
        HttpStatus.NOT_FOUND,
      );
    }

    return track;
  }

  async findByIds(ids: string[]) {
    const tracks = await this.findAll();
    return tracks.filter((track) => ids.includes(track.id));
  }

  async create(track: Track) {
    return this.prisma.track.create({
      data: track,
    });
  }

  async update(id: string, updateTrackDto: UpdateTrackDto) {
    const track = await this.prisma.track.findUnique({ where: { id } });

    if (!track) {
      throw new HttpException(
        'Track with provided id is not found',
        HttpStatus.NOT_FOUND,
      );
    }

    return this.prisma.track.update({
      data: {
        ...track,
        ...updateTrackDto,
      },
      where: {
        id,
      },
    });
  }

  async remove(id: string) {
    const track = await this.prisma.track.findUnique({ where: { id } });

    if (!track) {
      throw new HttpException(
        'Track with provided id is not found',
        HttpStatus.NOT_FOUND,
      );
    }

    await this.favoriteService.removeTrackFromFavorite(id);
    await this.prisma.track.delete({
      where: {
        id,
      },
    });
  }

  async clearArtistTracks(artistId: string) {
    const tracks = await this.findAll();
    const artistTracks = tracks.filter((track) => track.artistId === artistId);

    for (const artistTrack of artistTracks) {
      artistTrack.artistId = null;
      await this.favoriteService.removeTrackFromFavorite(artistTrack.id);
    }
  }

  async clearAlbumTracks(album: string) {
    const tracks = await this.findAll();
    const albumTracks = tracks.filter((track) => track.albumId === album);

    for (const albumTrack of albumTracks) {
      albumTrack.albumId = null;
      await this.favoriteService.removeTrackFromFavorite(albumTrack.id);
    }
  }
}
