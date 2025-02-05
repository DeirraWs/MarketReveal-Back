import { Inject, Injectable } from '@nestjs/common';
import { CommandService, Handler } from 'src/tg-bot/command/command.service';
import { DialogService } from '../../../dialog/dialog.service';
import { MyContext } from '../../../tg-bot.service';
import { MenuService } from '../../menu.service';


@Injectable()
export class SetState extends Handler {

  constructor(@Inject()  private _commandService: CommandService,
              @Inject() private dialogService: DialogService) {

    super();
    this._commandService.addHandler('stet-filter-sate', this);
  }

  async handlerLogic(context: MyContext, state: string): Promise<any> {
    try {
      if (state) {
        context.session.searchData.searchParams.filters['state'] = state;
      }
      await this._commandService.handle('generate-search-properties-message', context);

    } catch (e) {
      await context.reply(context.t('search-process-finish-not-success'));
    }
  }
}

@Injectable()
export class OpenSetFilterStateMenu extends Handler {

  constructor(@Inject() commandService: CommandService,
              private readonly menuService: MenuService,
  ) {
    super();
    commandService.addHandler('change-filter-state-menu-open', this);
  }

  async handlerLogic(context: MyContext): Promise<any> {
    await context.reply(context.t('state.inputDesc'), {
      reply_markup: this.menuService.getMenuClass('choose-filter-state-menu').getMenu(),
    });
  }
}

