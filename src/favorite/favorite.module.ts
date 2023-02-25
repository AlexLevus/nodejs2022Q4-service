import { Module } from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { FavoriteController } from './favorite.controller';
import { ArtistService } from '../artist/artist.service';
import { TrackService } from '../track/track.service';
import { AlbumService } from '../album/album.service';

@Module({
  controllers: [FavoriteController],
  providers: [
    FavoriteService,
    ArtistService,
    AlbumService,
    TrackService,
  ],
})
export class FavoriteModule {}
