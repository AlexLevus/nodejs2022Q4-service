import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  Put,
  HttpCode,
  ClassSerializerInterceptor,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { validate as uuidValidate } from 'uuid';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('user')
  findAll() {
    return this.userService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('user/:id')
  findOne(@Param('id') id: string) {
    if (!uuidValidate(id)) {
      throw new HttpException('Invalid user id', HttpStatus.BAD_REQUEST);
    }
    return this.userService.findOne(id);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post(['user', 'auth/signup'])
  create(@Body() { login, password }: CreateUserDto) {
    if (typeof login !== 'string' || typeof password !== 'string') {
      throw new HttpException(
        'Required fields are not provided',
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.userService.create({ login, password });
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Put('user/:id')
  update(
    @Param('id') id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    if (!uuidValidate(id)) {
      throw new HttpException('Invalid user id', HttpStatus.BAD_REQUEST);
    }

    if (!updatePasswordDto.newPassword || !updatePasswordDto.oldPassword) {
      throw new HttpException(
        'Required fields are not provided',
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.userService.updateUserPassword(id, updatePasswordDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('user/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    if (!uuidValidate(id)) {
      throw new HttpException('Invalid user id', HttpStatus.BAD_REQUEST);
    }

    return this.userService.remove(id);
  }
}
