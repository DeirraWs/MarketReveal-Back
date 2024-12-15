import { Module } from '@nestjs/common';
import { TgBotService } from './tg-bot.service';
import {CommandModule} from "./command/command.module";
import {MenuModule} from "./menu/menu.module";
import {DialogModule} from "./dialog/dialog.module";
import { SearchManageModule } from '../search/search-manage/search-manage.module';
import { AuthModule } from 'src/auth/auth.module';



@Module({
  providers: [TgBotService],
  imports: [
      CommandModule,
      MenuModule,
      DialogModule,
      SearchManageModule,
      AuthModule
  ],
    exports: [
        TgBotService
    ]
})
export class TgBotModule {}
