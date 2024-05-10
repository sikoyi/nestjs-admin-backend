import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterUserDto } from './dto/register-user.dto';
import { RedisService } from 'src/redis/redis.service';
import { md5 } from 'src/utils/md5';
import { Role } from 'src/role/entities/role.entity';
import { LoginUserDto } from './dto/login-user-dto';
import { LoginUserVo } from './vo/login-user.vo';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  private logger = new Logger();

  @InjectRepository(User)
  private userRepository: Repository<User>;

  @Inject(RedisService)
  private redisService: RedisService;

  @InjectRepository(Role)
  private roleRepository: Repository<Role>;

  @Inject(JwtService)
  private jwtService: JwtService;

  @Inject(ConfigService)
  private configService: ConfigService;

  async register(user: RegisterUserDto): Promise<'注册成功' | '注册失败'> {
    const captcha = await this.redisService.get(
      `register_captcha_${user.email}`,
    );

    if (!captcha) {
      throw new HttpException('验证码已失效', HttpStatus.BAD_REQUEST);
    }

    if (user.captcha.toLocaleLowerCase() != captcha) {
      throw new HttpException('验证码不正确', HttpStatus.BAD_REQUEST);
    }

    const foundUser = await this.userRepository.findOneBy({
      username: user.username,
    });
    if (foundUser) {
      throw new HttpException('用户已存在', HttpStatus.BAD_REQUEST);
    }

    const newUser = new User();
    newUser.username = user.username;
    newUser.password = md5(user.password);
    newUser.email = user.email;
    newUser.nickName = user.nickName;

    try {
      await this.userRepository.save(newUser);
      return '注册成功';
    } catch (error) {
      this.logger.error(error, UserService);
      return '注册失败';
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.userRepository.findOneBy({
      username: loginUserDto.username,
    });

    const vo = new LoginUserVo();
    vo.userInfo = {
      id: user.id,
      username: user.username,
      nickName: user.nickName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      avatar: user.avatar,
      createTime: user.createTime.getTime(),
      isFrozen: user.isFrozen,
      roles: user.roles.map((item) => item.roleName),
    };

    return vo;
  }

  async initData() {
    const user1 = new User();
    user1.username = 'zhangsan';
    user1.password = md5('111111');
    user1.email = 'xxx@xx.com';
    user1.nickName = '张三';
    user1.phoneNumber = '13233323333';

    const user2 = new User();
    user2.username = 'lisi';
    user2.password = md5('222222');
    user2.email = 'yy@yy.com';
    user2.nickName = '李四';

    const role1 = new Role();
    role1.roleName = '管理员';

    const role2 = new Role();
    role2.roleName = '普通用户';

    user1.roles = [role1];
    user2.roles = [role2];

    await this.roleRepository.save([role1, role2]);
    await this.userRepository.save([user1, user2]);
  }
}
