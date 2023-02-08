import { Injectable } from '@nestjs/common';
import Collection from '../in-memory-db/collection';
import { User } from './entities/user.entity';
import InMemoryDb from '../in-memory-db/in-memory-db.entity';
import Repository from '../typings/repository';

@Injectable()
export class UserRepository implements Repository<User> {
  collection: Collection<User>;

  constructor(private database: InMemoryDb) {
    this.collection = database.getCollection('users');
  }

  async all(): Promise<User[]> {
    return this.collection.all();
  }

  async findOne(id: string): Promise<User | undefined> {
    return this.collection.findOne(id);
  }

  async create(item: User): Promise<User> {
    return this.collection.insert(item);
  }

  async delete(id: string): Promise<boolean> {
    return this.collection.delete(id);
  }

  async update(id: string, item: User): Promise<User> {
    return this.collection.update(id, item);
  }
}
