import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { ArtistRepository } from './artist.repository';
import { Artist } from './entities/artist.entity';
import { TrackService } from '../track/track.service';
import { FavoriteService } from '../favorite/favorite.service';

@Injectable()
export class ArtistService {
  constructor(
    private artistRepository: ArtistRepository,
    @Inject(forwardRef(() => TrackService))
    private trackService: TrackService,
    @Inject(forwardRef(() => FavoriteService))
    private favoriteService: FavoriteService,
  ) {}

  async findAll() {
    return this.artistRepository.all();
  }

  async findOne(id: string, customError?: boolean) {
    const album = await this.artistRepository.findOne(id);

    if (!album && !customError) {
      throw new HttpException(
        'Artist with provided id is not found',
        HttpStatus.NOT_FOUND,
      );
    }

    return album;
  }

  async findByIds(ids: string[]) {
    const artists = await this.findAll();
    return artists.filter((artist) => ids.includes(artist.id));
  }

  async create(createArtistDto: Omit<Artist, 'id'>) {
    const artist = new Artist(createArtistDto.name, createArtistDto.grammy);
    return this.artistRepository.create(artist);
  }

  async update(id: string, updateArtistDto: Omit<Artist, 'id'>) {
    const artist = await this.artistRepository.findOne(id);

    if (!artist) {
      throw new HttpException(
        'Artist with provided id is not found',
        HttpStatus.NOT_FOUND,
      );
    }

    return this.artistRepository.update(id, {
      ...artist,
      ...updateArtistDto,
    });
  }

  async remove(id: string) {
    const artist = await this.artistRepository.findOne(id);

    if (!artist) {
      throw new HttpException(
        'Artist with provided id is not found',
        HttpStatus.NOT_FOUND,
      );
    }

    await this.favoriteService.removeArtistFromFavorite(id);
    await this.trackService.clearArtistTracks(id);
    await this.artistRepository.delete(id);
  }
}
