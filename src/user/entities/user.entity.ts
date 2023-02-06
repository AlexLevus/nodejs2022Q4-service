import { v4 as uuidv4 } from 'uuid';
import { Exclude } from 'class-transformer';

export class User {
  id: string;
  login: string;
  version: number;
  createdAt: number;
  updatedAt: number;

  @Exclude()
  password: string;

  constructor(
    login: string,
    password: string,
    version?: number,
    createdAt?: number,
    updatedAt?: number,
  ) {
    this.id = uuidv4();
    this.password = password;
    this.login = login;
    this.version = version ?? 1;
    this.createdAt = createdAt ?? new Date().getTime();
    this.updatedAt = updatedAt ?? new Date().getTime();
  }
}
