import { Injectable } from '@nestjs/common';
import Collection from '../in-memory-db/collection';
import { Artist } from './entities/Artist.entity';
import InMemoryDb from '../in-memory-db/in-memory-db.entity';
import Repository from '../typings/repository';

@Injectable()
export class ArtistRepository implements Repository<Artist> {
  collection: Collection<Artist>;

  constructor(private database: InMemoryDb) {
    this.collection = database.getCollection('artists');
  }

  async all(): Promise<Artist[]> {
    return this.collection.all();
  }

  async findOne(id: string): Promise<Artist | undefined> {
    return this.collection.findOne(id);
  }

  async create(item: Artist): Promise<Artist> {
    return this.collection.insert(item);
  }

  async delete(id: string): Promise<boolean> {
    return this.collection.delete(id);
  }

  async update(id: string, item: Artist): Promise<Artist> {
    return this.collection.update(id, item);
  }
}
