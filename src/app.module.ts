import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { createClient } from 'redis';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '123456',
      database: 'task_admin',
      synchronize: true,
      logging: true, // 是否打印 sql 语句
      entities: [], // 表
      poolSize: 10, // 连接数量
      connectorPackage: 'mysql2', // 连接池
      extra: {
        authPlugin: 'sha256_password',
      },
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // 注册 Redis 模块
    {
      provide: 'REDIS_CLIENT',
      async useFactory() {
        const client = createClient({
          socket: {
            host: 'localhost',
            port: 6379,
          },
        });

        await client.connect();
        return client;
      },
    },
  ],
})
export class AppModule {}
