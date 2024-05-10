import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { MenuModule } from './menu/menu.module';
import { User } from './user/entities/user.entity';
import { Role } from './role/entities/role.entity';
import { Menu } from './menu/entities/menu.entity';
import { RedisModule } from './redis/redis.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    JwtModule.registerAsync({
      global: true,
      useFactory(configService: ConfigService) {
        return {
          secret: configService.get('jwt_secret'),
          signOptions: {
            expiresIn: configService.get('jwt_access_token_expires_time'), // 默认30分钟
          },
        };
      },
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync({
      useFactory(configService: ConfigService) {
        console.log(configService.get('mysql_server_host'));
        return {
          type: 'mysql',
          host: configService.get('mysql_server_host'),
          port: configService.get('mysql_server_port'),
          username: configService.get('mysql_server_username'),
          password: configService.get('mysql_server_password'),
          database: configService.get('mysql_server_database'),
          synchronize: true,
          logging: true, // 是否打印 sql 语句
          entities: [User, Role, Menu], // 表
          poolSize: 10, // 连接数量
          connectorPackage: 'mysql2', // 连接池
          extra: {
            authPlugin: 'sha256_password',
          },
        };
      },
      inject: [ConfigService],
    }),
    UserModule,
    RoleModule,
    MenuModule,
    RedisModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
