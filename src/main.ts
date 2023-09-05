import helmet from 'helmet';
import { json, urlencoded } from 'body-parser';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
    }),
  );
  app.use(json({ limit: Infinity }));
  app.use(urlencoded({ limit: Infinity, extended: true }));
  app.enableCors({
    origin: '*',
    allowedHeaders: 'Content-Type, Accept, Authorization',
    credentials: true,
  });

  if (configService.get<string>('STATE') === 'production') {
    app.use(helmet());
  }

  const port = configService.get<number>('PORT') || 3001;
  await app.listen(port);
  Logger.log(`Server running on port ${port}`, 'Bootstrap');
}
bootstrap();
