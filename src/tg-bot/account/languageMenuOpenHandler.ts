import { Inject, Injectable } from '@nestjs/common';
import { CommandService, Handler } from '../command/command.service';
import { MyContext } from '../tg-bot.service';
import { MenuService } from '../menu/menu.service';


@Injectable()
export class LanguageMenuOpenHandler extends Handler {
  constructor(
    @Inject() private menuService: MenuService,
    @Inject() commandService: CommandService,
  ) {
    super();
    commandService.addHandler('change-language-menu-open', this);
  }

  async handlerLogic(context: MyContext): Promise<any> {
    await context.reply(context.t('change_language_menu_text'), {
        reply_markup: this.menuService.getMenuClass('change-language-menu').getMenu(),
      },
    );
  }


}
