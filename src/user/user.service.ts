import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UserRepository } from './user.repository';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async findAll() {
    const users = await this.userRepository.all();
    return users.map(({ password, ...safeUser }) => safeUser);
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOne(id);

    if (!user) {
      throw new HttpException(
        'User with provided id is not found',
        HttpStatus.NOT_FOUND,
      );
    }

    const { password, ...safeUser } = user;

    return safeUser;
  }

  async create(createUserDto: CreateUserDto) {
    const user = new User(createUserDto.login, createUserDto.password);
    const { password, ...safeUser } = await this.userRepository.create(user);
    return safeUser;
  }

  async update(id: string, updatePasswordDto: UpdatePasswordDto) {
    const user = await this.userRepository.findOne(id);

    if (!user) {
      throw new HttpException(
        'User with provided id is not found',
        HttpStatus.NOT_FOUND,
      );
    }

    if (user.password !== updatePasswordDto.oldPassword) {
      throw new HttpException('Incorrect password', HttpStatus.FORBIDDEN);
    }

    const { password, ...safeUser } = await this.userRepository.update(id, {
      ...user,
      password: updatePasswordDto.newPassword,
      version: user.version + 1,
      updatedAt: new Date().getTime(),
    });

    return safeUser;
  }

  async remove(id: string) {
    const user = await this.userRepository.findOne(id);

    if (!user) {
      throw new HttpException(
        'User with provided id is not found',
        HttpStatus.NOT_FOUND,
      );
    }

    await this.userRepository.delete(id);
  }
}
