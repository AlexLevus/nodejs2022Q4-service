import { Module } from '@nestjs/common';
import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';
import { AlbumRepository } from './album.repository';
import { TrackService } from '../track/track.service';
import { TrackRepository } from '../track/track.repository';
import { FavoriteService } from '../favorite/favorite.service';
import { FavoriteRepository } from '../favorite/favorite.repository';
import { ArtistService } from '../artist/artist.service';
import { ArtistRepository } from '../artist/artist.repository';

@Module({
  controllers: [AlbumController],
  providers: [
    AlbumService,
    AlbumRepository,
    ArtistService,
    ArtistRepository,
    TrackService,
    TrackRepository,
    FavoriteService,
    FavoriteRepository,
  ],
  exports: [AlbumService, AlbumRepository],
})
export class AlbumModule {}
