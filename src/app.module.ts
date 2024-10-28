import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DataBaseProviderModule } from './data-base-provider/data-base-provider.module';

@Module({
  imports: [DataBaseProviderModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
