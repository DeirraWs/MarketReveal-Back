import { Inject, Injectable } from '@nestjs/common';
import { CommandService, Handler } from '../command/command.service';
import { MyContext } from '../tg-bot.service';
import { MenuService } from '../menu/menu.service';


@Injectable()
export class AccountCloseHandler extends Handler {
  constructor(
    @Inject() private menuService: MenuService,
    @Inject() commandService: CommandService,
  ) {
    super();
    commandService.addHandler('account-close', this);
  }

  async handlerLogic(context: MyContext): Promise<any> {
    await context.reply(context.t('main_menu_text'), {
        reply_markup: this.menuService.getMenuClass('main-menu').getMenu(),
      },
    );
  }


}

