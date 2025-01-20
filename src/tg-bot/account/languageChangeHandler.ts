import { Inject, Injectable } from '@nestjs/common';
import { CommandService, Handler } from '../command/command.service';
import { MyContext } from '../tg-bot.service';
import { MenuService } from '../menu/menu.service';


@Injectable()
export class LanguageChangeHandler extends Handler {
  constructor(
    @Inject() private menuService: MenuService,
    @Inject() commandService: CommandService,
  ) {
    super();
    commandService.addHandler('language-change', this);
  }

  async handlerLogic(context: MyContext, locale:string): Promise<any> {
      await context.i18n.setLocale(locale);
      await context.reply(context.t("selected_language"));
      await context.reply(context.t('menu_account_text'),{
        reply_markup: this.menuService.getMenuClass("account-menu").getMenu()
      })
  }


}
