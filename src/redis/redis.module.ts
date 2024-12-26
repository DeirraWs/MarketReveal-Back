import { Module } from '@nestjs/common';
import {RedisCacheService} from './redis.service';

@Module({
  providers: [RedisCacheService],
  exports: [RedisCacheService],
})
export class RedisModule {}
