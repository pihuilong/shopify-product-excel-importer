import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { LoggerService } from './internal';

async function bootstrap() {
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule);

  // NOTE: Setup logger
  app.useLogger(app.get(LoggerService));

  await app.listen(process.env.PORT, () => {
    logger.log(`Application is running on port: ${process.env.PORT}`);
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
