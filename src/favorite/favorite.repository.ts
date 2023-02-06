import { Injectable } from '@nestjs/common';
import Collection from '../in-memory-db/collection';
import { Favorite } from './entities/Favorite.entity';
import InMemoryDb from '../in-memory-db/in-memory-db.entity';

@Injectable()
export class FavoriteRepository {
  collection: Collection<Favorite>;

  constructor(private database: InMemoryDb) {
    this.collection = database.getCollection('favorites');
  }

  async all(): Promise<Favorite> {
    return this.collection.data[0];
  }

  async like(name: string, id: string) {
    const [favorites] = this.collection.data;
    favorites[name] = [...favorites[name], id];
  }

  async dislike(name: string, id: string) {
    const [favorites] = this.collection.data;
    favorites[name] = favorites[name].filter((fav) => fav !== id);
  }
}
