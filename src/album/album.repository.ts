import { Injectable } from '@nestjs/common';
import Collection from '../in-memory-db/collection';
import { Album } from './entities/Album.entity';
import InMemoryDb from '../in-memory-db/in-memory-db.entity';
import Repository from '../typings/repository';

@Injectable()
export class AlbumRepository implements Repository<Album> {
  collection: Collection<Album>;

  constructor(private database: InMemoryDb) {
    this.collection = database.getCollection('albums');
  }

  async all(): Promise<Album[]> {
    return this.collection.all();
  }

  async findOne(id: string): Promise<Album | undefined> {
    return this.collection.findOne(id);
  }

  async create(item: Album): Promise<Album> {
    return this.collection.insert(item);
  }

  async delete(id: string): Promise<boolean> {
    return this.collection.delete(id);
  }

  async update(id: string, item: Album): Promise<Album> {
    return this.collection.update(id, item);
  }
}
