import { Module } from '@nestjs/common';
import { TrackService } from './track.service';
import { TrackController } from './track.controller';
import { FavoriteService } from '../favorite/favorite.service';
import { AlbumService } from '../album/album.service';
import { ArtistService } from '../artist/artist.service';

@Module({
  controllers: [TrackController],
  providers: [TrackService, AlbumService, ArtistService, FavoriteService],
  exports: [TrackService],
})
export class TrackModule {}
