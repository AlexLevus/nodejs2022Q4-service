import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { PrismaService } from 'nestjs-prisma';

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

  async create(createUserDto: CreateUserDto) {
    const user = await this.prisma.user.create({
      data: {
        login: createUserDto.login,
        password: createUserDto.password,
        createdAt: new Date().getTime(),
        updatedAt: new Date().getTime(),
      },
    });

    return exclude(user, ['password']);
  }

  async update(id: string, updatePasswordDto: UpdatePasswordDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new HttpException(
        'User with provided id is not found',
        HttpStatus.NOT_FOUND,
      );
    }

    if (user.password !== updatePasswordDto.oldPassword) {
      throw new HttpException('Incorrect password', HttpStatus.FORBIDDEN);
    }

    const updatedUser = await this.prisma.user.update({
      data: {
        password: updatePasswordDto.newPassword,
        updatedAt: new Date().getTime(),
        version: user.version + 1,
      },
      where: { id },
    });

    return exclude(updatedUser, ['password']);
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
