import { Module } from '@nestjs/common';
import { TgBotService } from './tg-bot.service';
import {CommandModule} from "./command/command.module";
import {MenuModule} from "./menu/menu.module";
import {DialogModule} from "./dialog/dialog.module";


@Module({
  providers: [TgBotService],
  imports: [
      CommandModule,
      MenuModule,
      DialogModule
  ],
    exports: [
        TgBotService
    ]
})
export class TgBotModule {}
