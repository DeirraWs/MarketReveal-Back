import { CommandService, Handler } from '../../../tg-bot/command/command.service';
import { Inject, Injectable } from '@nestjs/common';
import { MenuService } from '../../../tg-bot/menu/menu.service';
import { MyContext } from '../../../tg-bot/tg-bot.service';
import MenuPagination from '../../../tg-bot/menu/menuResultShow';

@Injectable()
export class SearchStopResultShowHandler extends Handler {

  constructor(
    @Inject() commandService: CommandService,
    @Inject() private  menuService: MenuService,
    @Inject() private menuPagination: MenuPagination,
  ) {
    super();
    commandService.addHandler('stop-result-search', this);
  }

  async handlerLogic(context: MyContext): Promise<any> {
    context.session.searchData.res = {};
    // await context.deleteMessage()
    await context.reply("Головне меню",{
      reply_markup: this.menuService.getMenu()
    })
  }

}