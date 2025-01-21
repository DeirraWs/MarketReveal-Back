import { Module } from '@nestjs/common';
import { RedisModule } from '../../redis/redis.module';
import { CacheTrackingService } from './cache-serch.service';


@Module({
  providers: [CacheTrackingService],
  controllers: [],
  exports: [CacheTrackingService],
  imports: [
    RedisModule
  ],
})
export class CacheSearchModule {}
