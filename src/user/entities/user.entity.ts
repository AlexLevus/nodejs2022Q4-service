import { v4 as uuidv4 } from 'uuid';

export class User {
  id: string;
  login: string;
  password: string;
  version: number;
  createdAt: number;
  updatedAt: number;

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
