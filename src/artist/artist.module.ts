import { Module } from '@nestjs/common';
import { ArtistService } from './artist.service';
import { ArtistController } from './artist.controller';
import { TrackService } from '../track/track.service';
import { FavoriteService } from '../favorite/favorite.service';
import { AlbumService } from '../album/album.service';

@Module({
  controllers: [ArtistController],
  providers: [ArtistService, TrackService, AlbumService, FavoriteService],
  exports: [ArtistService],
})
export class ArtistModule {}
