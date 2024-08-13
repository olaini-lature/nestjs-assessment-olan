import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('MainApp', { timestamp: true });
  const port = process.env.PORT;

  app.enableCors();

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(port);
  logger.log(`Application listening on port ${port}`);
}
bootstrap();
