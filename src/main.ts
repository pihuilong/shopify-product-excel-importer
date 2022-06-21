import { Logger, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { LoggerService } from './internal';

async function bootstrap() {
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule);

  // NOTE: Setup logger
  app.useLogger(app.get(LoggerService));
  // NOTE: Setup API prefix and versioning
  app.setGlobalPrefix('api', { exclude: ['/health'] });
  app.enableVersioning({
    type: VersioningType.URI,
  });
  // NOTE: Setup Swagger documentation
  const options = new DocumentBuilder()
    .setTitle('User API')
    .setDescription('A RESTful API Backend that can import products to shopify via Excel.')
    .setVersion('v 0.0.1')
    .addBearerAuth()
    .addServer(process.env.SWAGGER_URL)
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT, () => {
    logger.log(`Application is running on port: ${process.env.PORT}`);
    logger.log(`Swagger API Docs address: http://localhost:${process.env.PORT}/docs/`);
  });

  process.on('unhandledRejection', (reason: Error, promise) => {
    if (!(reason instanceof Error)) {
      reason = new Error(reason);
    }
    const errorJson = {
      message: `unhandledRejection: ${reason.message}`,
      stack: reason.stack,
      promise,
    };
    logger.error(errorJson);
  });

  process.on('uncaughtException', (error: Error) => {
    const errorJson = {
      message: `uncaughtException: ${error.message}`,
      stack: error.stack,
    };
    logger.error(errorJson);
  });
}
bootstrap();
