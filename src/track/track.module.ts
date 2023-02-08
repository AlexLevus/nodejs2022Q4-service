import { Module } from '@nestjs/common';
import { TrackService } from './track.service';
import { TrackController } from './track.controller';
import { TrackRepository } from './track.repository';
import { FavoriteService } from '../favorite/favorite.service';
import { FavoriteRepository } from '../favorite/favorite.repository';
import { AlbumService } from '../album/album.service';
import { AlbumRepository } from '../album/album.repository';
import { ArtistService } from '../artist/artist.service';
import { ArtistRepository } from '../artist/artist.repository';

@Module({
  controllers: [TrackController],
  providers: [
    TrackService,
    TrackRepository,
    AlbumService,
    AlbumRepository,
    ArtistService,
    ArtistRepository,
    FavoriteService,
    FavoriteRepository,
  ],
  exports: [TrackService, TrackRepository],
})
export class TrackModule {}
