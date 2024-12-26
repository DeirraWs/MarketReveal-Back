import { CommandService, Handler } from '../../../tg-bot/command/command.service';
import { Inject, Injectable } from '@nestjs/common';
import { MenuService } from '../../../tg-bot/menu/menu.service';
import { MyContext } from '../../../tg-bot/tg-bot.service';

@Injectable()
export class SearchStopResultShowHandler extends Handler {

  constructor(
    @Inject() commandService: CommandService,
    @Inject() private  menuService: MenuService,
  ) {
    super();
    commandService.addHandler('stop-result-search', this);
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