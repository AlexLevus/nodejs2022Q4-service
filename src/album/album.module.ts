import { Module } from '@nestjs/common';
import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';
import { TrackService } from '../track/track.service';
import { FavoriteService } from '../favorite/favorite.service';
import { ArtistService } from '../artist/artist.service';

@Module({
  controllers: [AlbumController],
  providers: [
    AlbumService,
    ArtistService,
    TrackService,
    FavoriteService,
  ],
  exports: [AlbumService],
})
export class AlbumModule {}
