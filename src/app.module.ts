import { Module } from '@nestjs/common';
import { TrackModule } from './track/track.module';
import { UserModule } from './user/user.module';
import { ArtistModule } from './artist/artist.module';
import { AlbumModule } from './album/album.module';
import { InMemoryDbModule } from './in-memory-db/in-memory-db.module';
import { FavoriteModule } from './favorite/favorite.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TrackModule,
    UserModule,
    ArtistModule,
    AlbumModule,
    InMemoryDbModule,
    FavoriteModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
