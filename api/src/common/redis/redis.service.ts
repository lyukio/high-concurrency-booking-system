import { Injectable, OnModuleDestroy, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private client?: Redis;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    this.client = new Redis({
      host: this.configService.get<string>('REDIS_HOST', 'localhost'),
      port: this.configService.get<number>('REDIS_PORT', 6379),
      lazyConnect: true,
    });

    this.client.on('connect', () => {
      this.logger.log('Redis connected');
    });

    this.client.on('error', (err) => {
      this.logger.error('Redis connection error', err.message);
    });

    await this.client.connect().catch((err) => {
      this.logger.error('Redis lazy connection failed', err.message);
    });
  }

  async onModuleDestroy() {
    if (!this.client) {
      return;
    }

    await this.client.quit();
    this.logger.log('Redis disconnected');
  }

  private getClient(): Redis {
    if (!this.client) {
      throw new Error('Redis client not initialized');
    }
    return this.client;
  }

  /**
   * SET key value EX ttl NX
   * Retorna true se a key foi criada (não existia), false se já existia.
   * Operação atômica — segura para uso como distributed lock.
   */
  async setNx(key: string, value: string, ttlSeconds: number): Promise<boolean> {
    const result = await this.getClient().set(key, value, 'EX', ttlSeconds, 'NX');
    return result === 'OK';
  }

  async get(key: string): Promise<string | null> {
    return this.getClient().get(key);
  }

  async del(key: string): Promise<void> {
    await this.getClient().del(key);
  }

  /**
   * Retorna o TTL restante em segundos.
   * -1 = sem expiração, -2 = key não existe.
   */
  async ttl(key: string): Promise<number> {
    return this.getClient().ttl(key);
  }
}