import { MiddlewareConsumer, Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import {
  AllExceptionFilter,
  HttpExceptionFilter,
  ResponseInterceptor,
  TraceIdMiddleware,
} from './common';
import { AppConfigModule } from './config';
import { MyLoggerModule, UtilModule } from './internal';

@Module({
  imports: [AppConfigModule, UtilModule, MyLoggerModule],
  controllers: [AppController],
  providers: [
    // NOTE: Register order and execution order are reversed(register earlier, execute later)
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    AppService,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TraceIdMiddleware).forRoutes('*');
  }
}
