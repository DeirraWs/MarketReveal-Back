import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisCacheService {
    private redisClient: Redis;

    constructor() {
        this.redisClient = new Redis({
            host: process.env.REDIS_HOST || '127.0.0.1', // Значення за замовчуванням
            port: parseInt(process.env.REDIS_PORT || '6379', 10),
            password: process.env.REDIS_PASSWORD || undefined,
        });
    }

    public async set(key: string, value: any, ttl?: number): Promise<void> {
        const stringValue = JSON.stringify(value);
        if (ttl) {
            await this.redisClient.set(key, stringValue, 'EX', ttl);
        } else {
            await this.redisClient.set(key, stringValue);
        }
    }

    public async get<T>(key: string): Promise<T | null> {
        const value = await this.redisClient.get(key);
        return value ? JSON.parse(value) : null;
    }

    public async has(key: string): Promise<boolean> {
        const exists = await this.redisClient.exists(key);
        return exists === 1;
    }

    public async delete(key: string): Promise<void> {
        await this.redisClient.del(key);
    }

    public close(): void {
        this.redisClient.quit();
    }
}

