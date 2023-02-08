interface Repository<T> {
  all(): Promise<T[]>;
  findOne(id: string): Promise<T | undefined>;

  create(item: T): Promise<T>;
  update(id: string, item: T): Promise<T>;
  delete(id: string): Promise<boolean>;
}

export default Repository;
