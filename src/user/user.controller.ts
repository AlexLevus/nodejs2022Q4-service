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
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { validate as uuidValidate } from 'uuid';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('user')
  findAll() {
    return this.userService.findAll();
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('user/:id')
  findOne(@Param('id') id: string) {
    if (!uuidValidate(id)) {
      throw new HttpException('Invalid user id', HttpStatus.BAD_REQUEST);
    }
    return this.userService.findOne(id);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('auth/signup')
  create(@Body() createUserDto: CreateUserDto) {
    if (!createUserDto.login || !createUserDto.password) {
      throw new HttpException(
        'Required fields are not provided',
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.userService.create(createUserDto);
  }

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

  @Delete('user/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    if (!uuidValidate(id)) {
      throw new HttpException('Invalid user id', HttpStatus.BAD_REQUEST);
    }

    return this.userService.remove(id);
  }
}
