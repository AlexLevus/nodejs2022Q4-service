import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TrackModule } from './track/track.module';
import { UserModule } from './user/user.module';
import { ArtistModule } from './artist/artist.module';
import { FavoritesModule } from './favorites/favorites.module';
import { AlbumModule } from './album/album.module';

@Module({
  imports: [
    TrackModule,
    UserModule,
    ArtistModule,
    FavoritesModule,
    AlbumModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
