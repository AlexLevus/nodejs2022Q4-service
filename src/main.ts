import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger } from './logger/logger';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
BigInt.prototype.toJSON = function () {
  return Number(this.toString());
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useLogger(new Logger());

  const config = new DocumentBuilder()
    .setTitle('REST API')
    .setDescription('The REST API description')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('doc', app, document);

  await app.listen(process.env.PORT ?? 4000);
}

bootstrap();
