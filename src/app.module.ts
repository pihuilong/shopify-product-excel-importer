import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfigModule } from './config';
import { MyLoggerModule, UtilModule } from './internal';

@Module({
  imports: [AppConfigModule, UtilModule, MyLoggerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
