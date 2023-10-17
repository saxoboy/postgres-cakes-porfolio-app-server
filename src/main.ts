import helmet from 'helmet';
import { json, urlencoded } from 'body-parser';
import { ConfigService } from '@nestjs/config';
import { BadRequestException, Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
      exceptionFactory: (errors) => {
        const formattedErrors = errors.reduce((acc, error) => {
          acc[error.property] = Object.values(error.constraints).join(', ');
          return acc;
        }, {});
        throw new BadRequestException({
          statusCode: 400,
          message: 'Validation error',
          errors: formattedErrors,
        });
      },
    }),
  );
  app.use(json({ limit: Infinity }));
  app.use(urlencoded({ limit: Infinity, extended: true }));
  if (configService.get<string>('STATE') === 'production') {
    app.use(helmet());
  }

  const logger = new Logger();
  app.useLogger(logger);

  app.enableCors({
    origin: configService.get<string>('CLIENT_URL'),
    credentials: true,
    allowedHeaders: [
      'Accept',
      'Authorization',
      'Content-Type',
      'X-Requested-With',
      'apollo-require-preflight',
    ],
    exposedHeaders: ['Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    //methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
  });

  const port = configService.get<number>('PORT') || 3001;
  await app.listen(port);
  Logger.log(`Server running on port ${port}`, 'Bootstrap');
}
bootstrap();
