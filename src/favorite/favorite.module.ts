import { Module } from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { FavoriteController } from './favorite.controller';
import { FavoriteRepository } from './favorite.repository';
import { ArtistService } from '../artist/artist.service';
import { AlbumRepository } from '../album/album.repository';
import { TrackService } from '../track/track.service';
import { TrackRepository } from '../track/track.repository';
import { AlbumService } from '../album/album.service';
import { ArtistRepository } from '../artist/artist.repository';

@Module({
  controllers: [FavoriteController],
  providers: [
    FavoriteService,
    FavoriteRepository,
    ArtistService,
    ArtistRepository,
    AlbumService,
    AlbumRepository,
    TrackService,
    TrackRepository,
  ],
})
export class FavoriteModule {}
