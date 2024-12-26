import { CommandService, Handler } from '../../../tg-bot/command/command.service';
import { Inject, Injectable } from '@nestjs/common';
import { MyContext } from '../../../tg-bot/tg-bot.service';
import MenuPagination from '../../../tg-bot/menu/menuResultShow';
import { ResultStructure, SearchResult } from '../../types/types';
import { MenuService } from '../../../tg-bot/menu/menu.service';

@Injectable()
export class SearchResultShowHandler extends Handler {

  constructor(
    @Inject() commandService: CommandService,
    @Inject() private menuPagination: MenuPagination,
    @Inject() private menuService: MenuService,
  ) {
    super();
    commandService.addHandler('start-result-search', this);
  }

  async handlerLogic(context: MyContext): Promise<any> {
    context.session.searchData.res = this._createCorrectFormatOfResult(context.session.searchData.res, context);
    await context.reply(this.menuPagination.getStartInfo(context),{
      reply_markup: this.menuService.getMenuClass("menu-pagination").getMenu()
    })
  }

  private _createCorrectFormatOfResult(res: SearchResult[], context: MyContext): string[] {
    const convertedResult: string[] = [];
    for (const searchResult of res) {
      if (searchResult.resultCode === 1){
        for (const result of searchResult.res) {
          convertedResult.push(this._formatResultToString(result, context));
        }
      }
    }
    return convertedResult;
  }

  private _formatResultToString(result: ResultStructure, context: MyContext): string {
    return `
📌 *${result.title}*
💰 ${context.t('price_text')}: ${result.price.amount} ${result.price.currency}
🕒 ${context.t('time_posted_text')}: ${result.timePosted}
🔗 [${context.t('view_text')}](${result.url})
🏷️ ${context.t('tags_text')}: ${result.tags.length > 0 ? result.tags.join(', ') : context.t('no_tags_text')}
📝 ${context.t('description_text')}:
${result.description ? result.description : context.t('no_description_text')}
`.trim();
  }
}