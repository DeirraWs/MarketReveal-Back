import { Inject, Injectable } from '@nestjs/common';
import { Dialog, DialogService } from 'src/tg-bot/dialog/dialog.service';
import { SearchManageService } from '../../../../search/search-manage/search-manage.service';
import { CommandService } from '../../../command/command.service';
import { MenuService } from '../../menu.service';
import { MyContext } from '../../../tg-bot.service';

@Injectable()
export class MinPriceDialog extends Dialog {
  name = "get-filter-min-price";

  constructor(
    @Inject() private searchManager: SearchManageService ,
    @Inject() private commandService: CommandService ,
    private readonly dialogService: DialogService,
    private readonly menuService: MenuService,
  ) {
    super();
    dialogService.registerDialog(this)
  }

  async start(ctx: MyContext): Promise<void> {
    ctx.session.activeDialog = this.name;
    ctx.session.dialogData = {};
  }

  async processMessage(ctx: MyContext): Promise<void> {
    const dialogData = ctx.session.dialogData;

    if (!dialogData.searchName) {
      dialogData.searchName = ctx.message?.text;
      try {
        if (!isNaN(Number(dialogData.searchName))) {
          ctx.session.searchData.searchParams.filters["minPrice"] = Math.abs(parseInt(dialogData.searchName));
          if (parseInt(dialogData.searchName) === 0){
            delete ctx.session.searchData.searchParams.filters["maxPrice"];
          }
        }
        await this.commandService.handle('generate-search-properties-message', ctx);
        await this.end(ctx)
      } catch (e){
        await ctx.reply(ctx.t("search-process-finish-not-success"))
        await this.end(ctx)
      }
    }
  }
}

@Injectable()
export class MaxPriceDialog extends Dialog {
  name = "get-filter-max-price";

  constructor(
    @Inject() private searchManager: SearchManageService ,
    @Inject() private commandService: CommandService ,
    private readonly dialogService: DialogService,
    readonly menuService: MenuService,
  ) {
    super();
    dialogService.registerDialog(this)
  }

  async start(ctx: MyContext): Promise<void> {
    ctx.session.activeDialog = this.name;
    ctx.session.dialogData = {};
  }

  async processMessage(ctx: MyContext): Promise<void> {
    const dialogData = ctx.session.dialogData;

    if (!dialogData.searchName) {
      dialogData.searchName = ctx.message?.text;
      try {
        if (!isNaN(Number(dialogData.searchName))) {
          ctx.session.searchData.searchParams.filters["maxPrice"] = Math.abs(parseInt(dialogData.searchName));
          if (parseInt(dialogData.searchName) === 0){
            delete ctx.session.searchData.searchParams.filters["maxPrice"];
          }
        }
        await this.commandService.handle('generate-search-properties-message', ctx);

        await this.end(ctx)
      } catch (e){
        await ctx.reply(ctx.t("search-process-finish-not-success"))
        await this.end(ctx)
      }
    }
  }
}