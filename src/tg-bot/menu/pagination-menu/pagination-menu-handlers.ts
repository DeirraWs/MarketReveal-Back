import { Inject, Injectable } from '@nestjs/common';
import { CommandService, Handler } from '../../command/command.service';
import MenuPagination from './pagination-menu';
import { MenuService } from '../menu.service';
import { MyContext } from '../../tg-bot.service';
import { ResultStructure, SearchResult } from '../../../search/types/types';


@Injectable()
export class StartPaginationMenu extends Handler {

  constructor(
    @Inject() private commandService: CommandService,
    @Inject() private menuPagination: MenuPagination,
    @Inject() private menuService: MenuService,
  ) {
    super();
    commandService.addHandler('start-pagination-menu', this);
  }

  async handlerLogic(context: MyContext): Promise<any> {
    context.session.searchData.dataTransformedToMenu = this._createCorrectFormatOfResult(context.session.searchData.data, context);

    this._initPaginationMenuVisualData(context);

    console.log(context.session.searchData.paginationMenu.additionalData);

    const menu = this.menuService.getMenuClass("menu-pagination");

    await context.reply(this.menuPagination.getStartInfo(context),{
      reply_markup: menu.getMenu()
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

  private _initPaginationMenuVisualData(ctx: MyContext): void {
    ctx.session.searchData.paginationMenu.additionalData = ctx.session.searchData.dataTransformedToMenu.map(()=>{
      return {
        extended:false,
        favorite:false
      }
    })
  }
}

@Injectable()
export class StopPaginationMenu extends Handler {

  constructor(
    @Inject() commandService: CommandService,
    @Inject() private  menuService: MenuService,
  ) {
    super();
    commandService.addHandler('stop-pagination-menu', this);
  }

  async handlerLogic(context: MyContext): Promise<any> {

    if (context.session.searchData.checkTrackedData){
      context.session.searchData.checkTrackedData = false;
      await context.reply("da",{
        reply_markup: this.menuService.getMenuClass("tracking-menu").getMenu()
      })
      return;
    }


    context.session.searchData.dataTransformedToMenu = [];
    await context.reply(context.t('main_menu_text'),{
      reply_markup: this.menuService.getMenuClass("main-menu").getMenu()
    })
  }

}