class Collection<T extends { id: string }> {
  data;

  constructor(data: T[]) {
    this.data = data;
  }

  async all(): Promise<T[]> {
    return Promise.resolve(this.data);
  }

  async findOne(id: string): Promise<T | undefined> {
    return Promise.resolve(this.data.find((item) => item.id === id));
  }

  async insert(item: T): Promise<T> {
    this.data.push(item);

    return Promise.resolve(item);
  }

  async update(id: string, updatedItem: T): Promise<T> {
    const item = await this.findOne(id);

    if (item) {
      this.data = this.data.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            ...updatedItem,
          };
        }

        return item;
      });
    }

    return Promise.resolve(updatedItem);
  }

  async delete(id: string): Promise<boolean> {
    const item = await this.findOne(id);

    if (item) {
      this.data = this.data.filter((item) => item.id !== id);
    }

    return Promise.resolve(Boolean(item));
  }
}

export default Collection;
