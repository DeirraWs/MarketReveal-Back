import { Inject, Injectable } from '@nestjs/common';
import { CommandService, Handler } from '../command/command.service';
import { MyContext } from '../tg-bot.service';
import { MenuService } from '../menu/menu.service';


@Injectable()
export class AccountOpenHandler extends Handler {
  constructor(
    @Inject() private menuService: MenuService,
    @Inject() commandService: CommandService,
  ) {
    super();
    commandService.addHandler('account-open', this);
  }

  async handlerLogic(context: MyContext): Promise<any> {
    await context.reply(context.t('menu_account_text'), {
        reply_markup: this.menuService.getMenuClass('account-menu').getMenu(),
      },
    );
  }


}

