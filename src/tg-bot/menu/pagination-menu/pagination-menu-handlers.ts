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

      await context.reply(this.menuPagination.getStartInfo(context), {
        reply_markup: this.menuPagination.getMenu(),
        parse_mode: "MarkdownV2"
      })
  }

  private _createCorrectFormatOfResult(res: SearchResult[], context: MyContext): string[] {
    const convertedResult: string[] = [];

    for (const searchResult of res) {
      if (searchResult.resultCode === 1){
        for (const result of searchResult.res) {
          convertedResult.push(this._escapeMarkdown(this._formatResultToString(result, context)));
        }
      }
    }
    return convertedResult;
  }

  private _formatResultToString(result: ResultStructure, context: MyContext): string {
    if (!result)
      return 'ERROR: Bed offers ';
    return `
📌 ${result.title}
💰 ${context.t('price_text')}: ${result.price.amount} ${result.price.currency}
🕒 ${context.t('time_posted_text')}: ${this._convertData(result.timePosted,context)}
🔗 [${context.t('view_text')}](${result.url})
🏷️ ${context.t('tags_text')}: ${result.tags.length > 0 ? result.tags.join(', ') : context.t('no_tags_text')}
📝 ${context.t('description_text')}:
${result.description ? result.description : context.t('no_description_text')}
`.trim();
  }

   private _escapeMarkdown(text:string):string {
    return text.replace(/([_*[\]()~`>#+\-=|{}.!\\])/g, '\\$1');
  }

  private _convertData(time: string, ctx: MyContext):string {
    const [year, month,day] = time.substring(0,10).split('-');
    const monthName = ctx.t(`month-${month}`);
    return `${day[0] === '0' ? day[1] : day} ${monthName} ${year}`;
  }

  private _initPaginationMenuVisualData(ctx: MyContext): void {
    const isFavorite = ctx.session.utilityFlags.favouriteChecking;
    ctx.session.searchData.paginationMenu.additionalData =
      ctx.session.searchData.dataTransformedToMenu.map(() => ({
        extended: false,
        favorite: isFavorite
      }));
  }
}

@Injectable()
export class StopPaginationMenu extends Handler {

  constructor(
    @Inject() private commandService: CommandService,
    @Inject() private  menuService: MenuService,
  ) {
    super();
    commandService.addHandler('stop-pagination-menu', this);
  }

  async handlerLogic(context: MyContext): Promise<any> {
    this._setDataByDefault(context);
    await this._checkFlags(context);
  }

  private _setDataByDefault(context:MyContext){
    context.session.searchData.paginationMenu.page = 0;
    context.session.searchData.paginationMenu.additionalData = [];
    context.session.searchData.dataTransformedToMenu = [];
    context.session.searchData.paginationMenu.currentTrackedUUID = null;
  }

  private async _checkFlags(context:MyContext){
    if (context.session.utilityFlags.favouriteChecking){
      context.session.utilityFlags.favouriteChecking = false;
    }
    if (context.session.searchData.paginationMenu.currentTrackedUUID) {
      await this.commandService.handle("start-tracking-menu", context);
    } else {
      await this.commandService.handle("start-main-menu",context)
    }
  }

}