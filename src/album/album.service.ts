import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { AlbumRepository } from './album.repository';
import { Album } from './entities/album.entity';
import { TrackService } from '../track/track.service';
import { FavoriteService } from '../favorite/favorite.service';

@Injectable()
export class AlbumService {
  constructor(
    private albumRepository: AlbumRepository,
    @Inject(forwardRef(() => TrackService))
    private trackService: TrackService,
    @Inject(forwardRef(() => FavoriteService))
    private favoriteService: FavoriteService,
  ) {}

  async findAll() {
    return this.albumRepository.all();
  }

  async findOne(id: string, customError?: boolean) {
    const album = await this.albumRepository.findOne(id);

    if (!album && !customError) {
      throw new HttpException(
        'Album with provided id is not found',
        HttpStatus.NOT_FOUND,
      );
    }

    return album;
  }

  async findByIds(ids: string[]) {
    const albums = await this.findAll();
    return albums.filter((album) => ids.includes(album.id));
  }

  async create(createAlbumDto: Omit<Album, 'id'>) {
    const album = new Album(
      createAlbumDto.name,
      createAlbumDto.year,
      createAlbumDto.artistId,
    );

    return this.albumRepository.create(album);
  }

  async update(id: string, updateAlbumDto: Omit<Album, 'id'>) {
    const album = await this.albumRepository.findOne(id);

    if (!album) {
      throw new HttpException(
        'Album with provided id is not found',
        HttpStatus.NOT_FOUND,
      );
    }

    return this.albumRepository.update(id, {
      ...album,
      ...updateAlbumDto,
    });
  }

  async remove(id: string) {
    const album = await this.albumRepository.findOne(id);

    if (!album) {
      throw new HttpException(
        'Album with provided id is not found',
        HttpStatus.NOT_FOUND,
      );
    }

    await this.trackService.clearAlbumTracks(id);
    await this.favoriteService.removeAlbumFromFavorite(id);
    await this.albumRepository.delete(id);
  }
}
