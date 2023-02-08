import { Module } from '@nestjs/common';
import { ArtistService } from './artist.service';
import { ArtistController } from './artist.controller';
import { ArtistRepository } from './artist.repository';
import { TrackService } from '../track/track.service';
import { TrackRepository } from '../track/track.repository';
import { FavoriteService } from '../favorite/favorite.service';
import { FavoriteRepository } from '../favorite/favorite.repository';
import { AlbumService } from '../album/album.service';
import { AlbumRepository } from '../album/album.repository';

@Module({
  controllers: [ArtistController],
  providers: [
    ArtistService,
    ArtistRepository,
    TrackService,
    TrackRepository,
    AlbumService,
    AlbumRepository,
    FavoriteService,
    FavoriteRepository,
  ],
  exports: [ArtistService, ArtistRepository],
})
export class ArtistModule {}
