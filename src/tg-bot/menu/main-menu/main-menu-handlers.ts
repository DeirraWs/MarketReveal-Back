import { Inject, Injectable } from '@nestjs/common';
import { CommandService, Handler } from '../../command/command.service';
import { MenuService } from '../menu.service';
import { MyContext } from '../../tg-bot.service';
import { MainMenu } from './main-menu';


@Injectable()
export class StartMainMenu extends Handler {

  constructor(
    @Inject() private commandService: CommandService,
    @Inject() private mainMenu: MainMenu,
    @Inject() private menuService: MenuService,
  ) {
    super();
    commandService.addHandler('start-main-menu', this);
  }

  async handlerLogic(context: MyContext): Promise<any> {

    await context.reply(context.t('main_menu_text'), {
      reply_markup: this.mainMenu.getMenu()
    })

  }
}
