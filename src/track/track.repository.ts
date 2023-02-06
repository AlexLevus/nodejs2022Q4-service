import { Injectable } from '@nestjs/common';
import Collection from '../in-memory-db/collection';
import InMemoryDb from '../in-memory-db/in-memory-db.entity';
import Repository from '../typings/repository';
import { Track } from './entities/track.entity';

@Injectable()
export class TrackRepository implements Repository<Track> {
  collection: Collection<Track>;

  constructor(private database: InMemoryDb) {
    this.collection = database.getCollection('tracks');
  }

  async all(): Promise<Track[]> {
    return this.collection.all();
  }

  async findOne(id: string): Promise<Track | undefined> {
    return this.collection.findOne(id);
  }

  async create(item: Track): Promise<Track> {
    return this.collection.insert(item);
  }

  async delete(id: string): Promise<boolean> {
    return this.collection.delete(id);
  }

  async update(id: string, item: Track): Promise<Track> {
    return this.collection.update(id, item);
  }
}
