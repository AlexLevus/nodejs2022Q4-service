import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { FavoriteRepository } from './favorite.repository';
import { TrackService } from '../track/track.service';
import { AlbumService } from '../album/album.service';
import { ArtistService } from '../artist/artist.service';

@Injectable()
export class FavoriteService {
  constructor(
    private favoriteRepository: FavoriteRepository,
    @Inject(forwardRef(() => TrackService))
    private readonly trackService: TrackService,
    @Inject(forwardRef(() => AlbumService))
    private readonly albumService: AlbumService,
    @Inject(forwardRef(() => ArtistService))
    private readonly artistService: ArtistService,
  ) {}

  async findAll() {
    const favs = await this.favoriteRepository.all();

    return {
      artists: await this.artistService.findByIds(favs.artists),
      albums: await this.albumService.findByIds(favs.albums),
      tracks: await this.trackService.findByIds(favs.tracks),
    };
  }

  async addTrackToFavorite(id: string) {
    const track = await this.trackService.findOne(id, true);

    if (!track) {
      throw new HttpException(
        'UNPROCESSABLE_ENTITY',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    await this.favoriteRepository.like('tracks', id);
  }

  async removeTrackFromFavorite(id: string) {
    const track = await this.trackService.findOne(id, true);

    if (!track) {
      throw new HttpException(
        'UNPROCESSABLE_ENTITY',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    await this.favoriteRepository.dislike('tracks', id);
  }

  async addAlbumToFavorite(id: string) {
    const album = await this.albumService.findOne(id, true);

    if (!album) {
      throw new HttpException(
        'UNPROCESSABLE_ENTITY',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    await this.favoriteRepository.like('albums', id);
  }

  async removeAlbumFromFavorite(id: string) {
    const album = await this.albumService.findOne(id, true);

    if (!album) {
      throw new HttpException(
        'UNPROCESSABLE_ENTITY',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    await this.favoriteRepository.dislike('albums', id);
  }

  async addArtistToFavorite(id: string) {
    const artist = await this.artistService.findOne(id, true);

    if (!artist) {
      throw new HttpException(
        'UNPROCESSABLE_ENTITY',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    await this.favoriteRepository.like('artists', id);
  }

  async removeArtistFromFavorite(id: string) {
    const artist = await this.artistService.findOne(id, true);

    if (!artist) {
      throw new HttpException(
        'UNPROCESSABLE_ENTITY',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    await this.favoriteRepository.dislike('artists', id);
  }
}
