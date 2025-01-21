import { CommandService, Handler } from '../../tg-bot/command/command.service';
import { MyContext } from '../../tg-bot/tg-bot.service';
import { undefined } from 'zod';
import { Inject, Injectable } from '@nestjs/common';
import { DialogService } from '../../tg-bot/dialog/dialog.service';

@Injectable()
export class dictionaryHandler extends Handler{

  constructor(@Inject() commandService : CommandService,
              @Inject() private dialogService : DialogService) {

    super();
    commandService.addHandler('search-synonyms', this);
  }

  async handlerLogic(context: MyContext): Promise<any> {
    await context.reply("Напишіть слово до якого хочете отримати синоніми")
    await this.dialogService.startDialog(context,"dictionary")
  }

}