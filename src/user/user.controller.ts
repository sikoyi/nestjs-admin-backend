import {
  Controller,
  Post,
  Body,
  HttpStatus,
  Get,
  Query,
  Inject,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import * as svgCaptcha from 'svg-captcha';
import { RedisService } from 'src/redis/redis.service';
import { LoginUserDto } from './dto/login-user-dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Controller('user')
export class UserController {
  @Inject(RedisService)
  private redisService: RedisService;

  @Inject(JwtService)
  private jwtService: JwtService;

  @Inject(ConfigService)
  private configService: ConfigService;

  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: '用户-注册',
  })
  @ApiBody({
    type: RegisterUserDto,
    required: true,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '注册成功',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '注册失败',
  })
  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto) {
    return await this.userService.register(registerUserDto);
  }

  /**
   * 获取注册验证码
   * @param address 邮箱地址
   * @returns
   */
  @ApiOperation({
    summary: '用户-注册-获取验证码',
  })
  @Get('register-captcha')
  async registerCaptcha(@Query('address') address: string) {
    const captcha = svgCaptcha.create({
      size: 4,
    });

    await this.redisService.set(
      `register_captcha_${address}`,
      captcha.text.toLowerCase(),
      5 * 60,
    );

    return captcha.data;
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    const vo = await this.userService.login(loginUserDto);

    vo.accessToken = this.jwtService.sign(
      {
        userId: vo.userInfo.id,
        username: vo.userInfo.username,
        roles: vo.userInfo.roles,
      },
      {
        expiresIn:
          this.configService.get('jwt_access_token_expires_time') || '30m',
      },
    );

    vo.refreshToken = this.jwtService.sign(
      {
        useId: vo.userInfo.id,
      },
      {
        expiresIn:
          this.configService.get('jwt_refresh_token_expres_time') || '7d',
      },
    );
    return vo;
  }
}
