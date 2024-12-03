import { CommandService, Handler } from '../../../tg-bot/command/command.service';
import { Inject, Injectable } from '@nestjs/common';
import { MenuService } from '../../../tg-bot/menu/menu.service';
import { MyContext } from '../../../tg-bot/tg-bot.service';
import MenuPagination from './menuResultShow';
import { SearchResult, ResultStructure } from '../../types/types';

@Injectable()
export class SearchResultShowHandler extends Handler {

  constructor(
    @Inject() commandService: CommandService,
    @Inject() menuService: MenuService,
    @Inject() private menuPagination: MenuPagination,
  ) {
    super();
    commandService.addHandler('start-result-search', this);
  }

  async handlerLogic(context: MyContext): Promise<any> {
    console.log("Log from handler",context.session.dialogData.res);
    context.session.dialogData.res = this._createCorrectFormatOfResult(context.session.dialogData.res);
    await context.reply(this.menuPagination.getStartInfo(context),{
      reply_markup: this.menuPagination.getMenu()
    })
  }

  private _createCorrectFormatOfResult(res: SearchResult[]){
    const convertedResult: string[] = [];
    for (const searchResult of res) {
      if (searchResult.resultCode === 1){
        for (const result of searchResult.res) {
          convertedResult.push(this._formatResultToString(result));
        }
      }
    }
    return convertedResult;
  }

  private _formatResultToString(result: ResultStructure): string {
    return `
📌 *${result.title}*
💰 Ціна: ${result.price.amount} ${result.price.currency}
🕒 Опубліковано: ${result.timePosted}
🔗 [Переглянути](<${result.url}>)
🏷️ Теги: ${result.tags.length > 0 ? result.tags.join(', ') : 'Немає тегів'}
📝 Опис:
${result.description ? result.description : 'Опис відсутній'}
    `.trim();
  }

}