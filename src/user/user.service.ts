import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { PrismaService } from 'nestjs-prisma';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';

function exclude<User, Key extends keyof User>(
  user: User,
  keys: Key[],
): Omit<User, Key> {
  for (const key of keys) {
    delete user[key];
  }
  return user;
}

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const users = await this.prisma.user.findMany();

    for (const user of users) {
      exclude(user, ['password']);
    }

    return users;
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new HttpException(
        'User with provided id is not found',
        HttpStatus.NOT_FOUND,
      );
    }

    return exclude(user, ['password']);
  }

  async getUser(login: string) {
    const user = await this.prisma.user.findUnique({
      where: { login },
    });

    if (!user) {
      throw new HttpException(
        'User with provided login is not found',
        HttpStatus.NOT_FOUND,
      );
    }

    return user;
  }

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const isUserCreated = await this.prisma.user.findUnique({
      where: { login: createUserDto.login },
    });

    if (isUserCreated) {
      return exclude(isUserCreated, ['password']);
    }

    const user = await this.prisma.user.create({
      data: {
        login: createUserDto.login,
        password: hashedPassword,
        createdAt: new Date().getTime(),
        updatedAt: new Date().getTime(),
      },
    });

    return exclude(user, ['password']);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new HttpException(
        'User with provided id is not found',
        HttpStatus.NOT_FOUND,
      );
    }

    const updatedUser = await this.prisma.user.update({
      data: {
        ...updateUserDto,
        updatedAt: new Date().getTime(),
        version: user.version + 1,
      },
      where: { id },
    });

    return exclude(updatedUser, ['password']);
  }

  async updateUserPassword(
    id: string,
    { oldPassword, newPassword }: UpdatePasswordDto,
  ) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new HttpException(
        'User with provided id is not found',
        HttpStatus.NOT_FOUND,
      );
    }

    const passwordValid = await bcrypt.compare(oldPassword, user.password);
    if (!passwordValid) {
      throw new HttpException('Incorrect password', HttpStatus.FORBIDDEN);
    }

    return await this.update(user.id, {
      password: newPassword,
    });
  }

  async remove(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new HttpException(
        'User with provided id is not found',
        HttpStatus.NOT_FOUND,
      );
    }

    await this.prisma.user.delete({ where: { id } });
  }
}
