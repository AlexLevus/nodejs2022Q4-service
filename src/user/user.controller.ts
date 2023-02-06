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
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { validate as uuidValidate } from 'uuid';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    if (!uuidValidate(id)) {
      throw new HttpException('Invalid user id', HttpStatus.BAD_REQUEST);
    }
    return this.userService.findOne(id);
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    if (!createUserDto.login || !createUserDto.password) {
      throw new HttpException(
        'Required fields are not provided',
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.userService.create(createUserDto);
  }

  @Put(':id')
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

    return this.userService.update(id, updatePasswordDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    if (!uuidValidate(id)) {
      throw new HttpException('Invalid user id', HttpStatus.BAD_REQUEST);
    }

    return this.userService.remove(id);
  }
}
