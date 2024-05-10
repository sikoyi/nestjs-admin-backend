import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 注册全局参数校验
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('后台管理系统接口')
    .setDescription('描述: 包含所有接口')
    .setVersion('v1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api-doc', app, document);

  const configService = app.get(ConfigService);
  await app.listen(configService.get('nest_server_port'));
}
bootstrap();
