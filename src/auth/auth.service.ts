import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async validateUser(login: string, password: string): Promise<User | null> {
    if (typeof login !== 'string' || typeof password !== 'string') {
      throw new HttpException('Invalid request body', HttpStatus.BAD_REQUEST);
    }

    const user = await this.userService.getUser(login);
    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.FORBIDDEN);
    }

    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      throw new HttpException('Invalid credentials', HttpStatus.FORBIDDEN);
    }

    return user;
  }

  async login(loginDto: LoginDto) {
    const validatedUser = await this.validateUser(
      loginDto.login,
      loginDto.password,
    );

    const tokens = await this.getTokens(validatedUser.id, validatedUser.login);
    await this.updateRefreshToken(validatedUser.id, tokens.refreshToken);

    return tokens;
  }

  async refreshToken(token: string) {
    const decodedJwtRefreshToken = this.jwtService.decode(token) as {
      userId: string;
      login: string;
      exp: number;
    };

    if (!decodedJwtRefreshToken) {
      throw new HttpException('Token is invalid', HttpStatus.FORBIDDEN);
    }

    if (decodedJwtRefreshToken.exp > Date.now()) {
      throw new HttpException('Token is expired', HttpStatus.FORBIDDEN);
    }

    const tokens = await this.getTokens(
      decodedJwtRefreshToken.userId,
      decodedJwtRefreshToken.login,
    );

    await this.updateRefreshToken(
      decodedJwtRefreshToken.userId,
      tokens.refreshToken,
    );

    return tokens;
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    await this.userService.update(userId, {
      refreshToken: hashedRefreshToken,
    });
  }

  async getTokens(id: string, login: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          userId: id,
          login,
        },
        {
          secret: process.env.JWT_ACCESS_SECRET,
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        {
          userId: id,
          login,
        },
        {
          secret: process.env.JWT_REFRESH_SECRET,
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
