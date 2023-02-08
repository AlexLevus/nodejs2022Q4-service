import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { UpdateTrackDto } from './dto/update-track.dto';
import { TrackRepository } from './track.repository';
import { Track } from './entities/track.entity';
import { FavoriteService } from '../favorite/favorite.service';

@Injectable()
export class TrackService {
  constructor(
    private trackRepository: TrackRepository,
    @Inject(forwardRef(() => FavoriteService))
    private favoriteService: FavoriteService,
  ) {}

  async findAll() {
    return this.trackRepository.all();
  }

  async findOne(id: string, customError?: boolean) {
    const track = await this.trackRepository.findOne(id);

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
    const trackToCreate = new Track(
      track.name,
      track.duration,
      track.artistId,
      track.albumId,
    );
    return this.trackRepository.create(trackToCreate);
  }

  async update(id: string, updateTrackDto: UpdateTrackDto) {
    const track = await this.trackRepository.findOne(id);

    if (!track) {
      throw new HttpException(
        'Track with provided id is not found',
        HttpStatus.NOT_FOUND,
      );
    }

    return this.trackRepository.update(id, {
      ...track,
      ...updateTrackDto,
    });
  }

  async remove(id: string) {
    const track = await this.trackRepository.findOne(id);

    if (!track) {
      throw new HttpException(
        'Track with provided id is not found',
        HttpStatus.NOT_FOUND,
      );
    }

    await this.favoriteService.removeTrackFromFavorite(id);
    await this.trackRepository.delete(id);
  }

  async clearArtistTracks(artistId: string) {
    const tracks = await this.findAll();
    const artistTracks = tracks.filter((track) => track.artistId === artistId);

    for (const artistTrack of artistTracks) {
      artistTrack.artistId = null;
      await this.trackRepository.update(artistTrack.id, artistTrack);
      await this.favoriteService.removeTrackFromFavorite(artistTrack.id);
    }
  }

  async clearAlbumTracks(album: string) {
    const tracks = await this.findAll();
    const albumTracks = tracks.filter((track) => track.albumId === album);

    for (const albumTrack of albumTracks) {
      albumTrack.albumId = null;
      await this.trackRepository.update(albumTrack.id, albumTrack);
      await this.favoriteService.removeTrackFromFavorite(albumTrack.id);
    }
  }
}
