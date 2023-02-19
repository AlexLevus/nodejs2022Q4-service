import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { TrackService } from '../track/track.service';
import { AlbumService } from '../album/album.service';
import { ArtistService } from '../artist/artist.service';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class FavoriteService {
  constructor(
    @Inject(forwardRef(() => TrackService))
    private readonly trackService: TrackService,
    @Inject(forwardRef(() => AlbumService))
    private readonly albumService: AlbumService,
    @Inject(forwardRef(() => ArtistService))
    private readonly artistService: ArtistService,
    private prisma: PrismaService,
  ) {}

  async findAll() {
    const favoriteTracks = (
      await this.prisma.favoriteTrack.findMany({
        include: {
          track: true,
        },
      })
    ).map((record) => record.track);

    const favoriteAlbums = (
      await this.prisma.favoriteAlbum.findMany({
        include: {
          album: true,
        },
      })
    ).map((record) => record.album);

    const favoriteArtists = (
      await this.prisma.favoriteArtist.findMany({
        include: {
          artist: true,
        },
      })
    ).map((record) => record.artist);

    return {
      artists: favoriteArtists,
      albums: favoriteAlbums,
      tracks: favoriteTracks,
    };
  }

  async addTrackToFavorite(id: string) {
    const track = await this.prisma.track.findUnique({ where: { id } });

    if (!track) {
      throw new HttpException(
        'UNPROCESSABLE_ENTITY',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    await this.prisma.favoriteTrack.create({
      data: {
        trackId: id,
      },
    });
  }

  async removeTrackFromFavorite(id: string) {
    const track = await this.trackService.findOne(id, true);

    if (!track) {
      throw new HttpException(
        'UNPROCESSABLE_ENTITY',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    await this.prisma.favoriteTrack.deleteMany({
      where: {
        trackId: id,
      },
    });
  }

  async addAlbumToFavorite(id: string) {
    const album = await this.prisma.album.findUnique({ where: { id } });

    if (!album) {
      throw new HttpException(
        'UNPROCESSABLE_ENTITY',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    await this.prisma.favoriteAlbum.create({
      data: {
        albumId: id,
      },
    });
  }

  async removeAlbumFromFavorite(id: string) {
    const album = await this.prisma.album.findUnique({ where: { id } });

    if (!album) {
      throw new HttpException(
        'UNPROCESSABLE_ENTITY',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    await this.prisma.favoriteAlbum.deleteMany({
      where: {
        albumId: id,
      },
    });
  }

  async addArtistToFavorite(id: string) {
    const artist = await this.prisma.artist.findUnique({ where: { id } });

    if (!artist) {
      throw new HttpException(
        'UNPROCESSABLE_ENTITY',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    await this.prisma.favoriteArtist.create({
      data: {
        artistId: id,
      },
    });
  }

  async removeArtistFromFavorite(id: string) {
    const artist = await this.prisma.artist.findUnique({ where: { id } });

    if (!artist) {
      throw new HttpException(
        'UNPROCESSABLE_ENTITY',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    await this.prisma.favoriteArtist.deleteMany({
      where: {
        artistId: id,
      },
    });
  }
}
