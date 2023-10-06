import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { EntityNotFoundErrorFilter } from './entity-not-found-error.filter';

async function bootstrap() {
  const logger = new Logger('app');
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new EntityNotFoundErrorFilter());
  await app.listen(3000);
  logger.log(`started in ${process.env.NODE_ENV} mode`);
}
bootstrap();
