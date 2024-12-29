import { ICacheTracking } from '../search-modules/ICache';
import { RedisCacheService } from '../../redis/redis.service';

export class CacheTrackingService extends ICacheTracking {
  private readonly namespace: string;

  constructor(
    private readonly redisCacheService: RedisCacheService,
    trackingId: string,
  ) {
    super();
    this.namespace = `tracking:${trackingId}`;
  }

  private getKey(key: string): string {
    return `${this.namespace}:${key}`;
  }

  async getNewUrls(urls: string[]): Promise<string[]> {
    const newUrls: string[] = [];
    for (const url of urls) {
      const exists = await this.redisCacheService.has(this.getKey(url));
      if (!exists) {
        newUrls.push(url);
        await this.redisCacheService.set(this.getKey(url), true);
      }
    }
    return newUrls;
  }

  async clearAllCache(): Promise<void> {
    const keys = await this.redisCacheService.getKeysByPattern(`${this.namespace}:*`);
    for (const key of keys) {
      await this.redisCacheService.delete(key);
    }
  }
}