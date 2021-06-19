require('dotenv').config(); // eslint-disable-line
import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from 'src/modules/app/app.module';
import { LoggerService } from 'src/modules/logger';
import { exit } from 'process';
import { KeycloakConfig } from './modules/auth/keycloakConfig';
import { AppAllExceptionsFilter } from './exception.filter';
import { bootstrapCamundaSub } from './camunda-subscriber';

async function bootstrap() {
  await KeycloakConfig.load();
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // Setting global prefix
  app.setGlobalPrefix('api');
  // CORS
  app.enableCors();
  // App Logging
  app.useLogger(app.get(LoggerService));

  // Exception filter
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AppAllExceptionsFilter(httpAdapter));

  // pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      disableErrorMessages: false,
    }),
  );

  // Logging node http server error
  app.getHttpServer().on('error', (excp) => {
    LoggerService.error(
      `Application server receive ${excp}`,
      undefined,
      'Bootstrap',
    );
    exit(1);
  });

  const port = parseInt(process.env.API_PORT, 10) || 3030;
  await app.listen(port);

  LoggerService.log(`Application is listing on port ${port}`, 'Bootstrap');
  bootstrapCamundaSub();
}
bootstrap();
