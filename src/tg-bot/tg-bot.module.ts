import { Module } from '@nestjs/common';
import { TgBotService } from './tg-bot.service';
import {CommandModule} from "./command/command.module";
import {MenuModule} from "./menu/menu.module";

@Module({
  providers: [TgBotService],
  imports: [
      CommandModule,
      MenuModule
  ]
})
export class TgBotModule {}
