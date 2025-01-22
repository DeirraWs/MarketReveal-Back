import { Inject, Injectable } from '@nestjs/common';
import { CommandService, Handler } from '../../command/command.service';
import { MenuService } from '../menu.service';
import { MyContext } from '../../tg-bot.service';
import { TrackingMenu } from './trackingMenu';

@Injectable()
export class StartTrackingMenu extends Handler {

  constructor(
    @Inject() private commandService: CommandService,
    @Inject() private trackingMenu: TrackingMenu,
    @Inject() private menuService: MenuService,
  ) {
    super();
    commandService.addHandler('start-tracking-menu', this);
  }

  async handlerLogic(context: MyContext): Promise<any> {

    await context.reply(context.t('tracking-menu-text'), {
      reply_markup: this.trackingMenu.getMenu()
    })

  }
}
