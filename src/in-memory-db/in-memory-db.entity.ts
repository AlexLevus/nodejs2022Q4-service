import Collection from './collection';
import { Injectable } from '@nestjs/common';

interface Database {
  getCollection<T extends { id: string }>(name: string): Collection<T>;
}

@Injectable()
class InMemoryDb implements Database {
  private collections: Record<string, Collection<any>> = {
    users: new Collection([]),
    tracks: new Collection([]),
    albums: new Collection([]),
    artists: new Collection([]),
    favorites: new Collection([
      {
        id: 'default',
        albums: [],
        artists: [],
        tracks: [],
      },
    ]),
  };

  getCollection(name: string) {
    return this.collections[name];
  }
}

export default InMemoryDb;
