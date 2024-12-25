import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { SequelizeModule } from "@nestjs/sequelize";
import * as process from "node:process";
import {User} from "./users/model/users.model";
import { RolesModule } from './roles/roles.module';
import {Role} from "./roles/models/roles.model";
import {UserRoles} from "./roles/models/userRole.model";
import { AuthModule } from './auth/auth.module';
import { TgBotModule } from './tg-bot/tg-bot.module';
import { SearchManageModule } from './search/search-manage/search-manage.module';
import { DictionaryModule } from './search/dictionary/dictionary.module';
import { OpenAiModule } from './open-ai/open-ai.module';
import { OffersTrackingModule } from './offers-tracking/offers-tracking.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
      ConfigModule.forRoot({
        isGlobal: true,
        envFilePath: ".development.env",
      }),
      SequelizeModule.forRoot({
          dialect: 'postgres',
          port: Number(process.env.POSTGRES_PORT),
          host: process.env.POSTGRES_HOST,
          username: process.env.POSTGRES_USERNAME,
          password: process.env.POSTGRES_PASSWORD,
          database: process.env.POSTGRES_DATABASE,
          models:[User,Role,UserRoles],
          autoLoadModels: true,
          synchronize: true,
          //sync: { force: true },
      })
    , UsersModule, RolesModule, AuthModule, TgBotModule, SearchManageModule, DictionaryModule, OpenAiModule, OffersTrackingModule, RedisModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
