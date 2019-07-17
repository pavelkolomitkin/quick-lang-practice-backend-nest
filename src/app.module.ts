import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoreModule } from './core/core.module';
import { ClientModule } from './client/client.module';

@Module({
  imports: [
      CoreModule,
      ClientModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
