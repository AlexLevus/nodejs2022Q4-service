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
    let [favorites] = await this.prisma.favorite.findMany();

    if (!favorites) {
      favorites = await this.prisma.favorite.create({
        data: {
          artists: [],
          albums: [],
          tracks: [],
        },
      });

      return favorites;
    }

    return {
      artists: await this.artistService.findByIds(favorites.artists),
      albums: await this.albumService.findByIds(favorites.albums),
      tracks: await this.trackService.findByIds(favorites.tracks),
    };
  }

  async like(name: string, id: string) {
    let [favorites] = await this.prisma.favorite.findMany();

    if (!favorites) {
      favorites = await this.prisma.favorite.create({
        data: {
          artists: [],
          albums: [],
          tracks: [],
        },
      });
    }

    return this.prisma.favorite.update({
      data: {
        [name]: [...favorites[name], id],
      },
      where: {
        id: favorites.id,
      },
    });
  }

  async dislike(name: string, id: string) {
    let [favorites] = await this.prisma.favorite.findMany();

    if (!favorites) {
      favorites = await this.prisma.favorite.create({
        data: {
          artists: [],
          albums: [],
          tracks: [],
        },
      });
    }

    return this.prisma.favorite.update({
      data: {
        [name]: favorites[name].filter((favoriteId) => favoriteId !== id),
      },
      where: {
        id: favorites.id,
      },
    });
  }

  async addTrackToFavorite(id: string) {
    const track = await this.prisma.track.findUnique({ where: { id } });

    if (!track) {
      throw new HttpException(
        'UNPROCESSABLE_ENTITY',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    await this.like('tracks', id);
  }

  async removeTrackFromFavorite(id: string) {
    const track = await this.trackService.findOne(id, true);

    if (!track) {
      throw new HttpException(
        'UNPROCESSABLE_ENTITY',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    await this.dislike('tracks', id);
  }

  async addAlbumToFavorite(id: string) {
    const album = await this.prisma.album.findUnique({ where: { id } });

    if (!album) {
      throw new HttpException(
        'UNPROCESSABLE_ENTITY',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    await this.like('albums', id);
  }

  async removeAlbumFromFavorite(id: string) {
    const album = await this.prisma.album.findUnique({ where: { id } });

    if (!album) {
      throw new HttpException(
        'UNPROCESSABLE_ENTITY',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    await this.dislike('albums', id);
  }

  async addArtistToFavorite(id: string) {
    const artist = await this.prisma.artist.findUnique({ where: { id } });

    if (!artist) {
      throw new HttpException(
        'UNPROCESSABLE_ENTITY',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    await this.like('artists', id);
  }

  async removeArtistFromFavorite(id: string) {
    const artist = await this.prisma.artist.findUnique({ where: { id } });

    if (!artist) {
      throw new HttpException(
        'UNPROCESSABLE_ENTITY',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    await this.dislike('artists', id);
  }
}
