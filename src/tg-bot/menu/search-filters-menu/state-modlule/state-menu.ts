import { Inject, Injectable } from '@nestjs/common';
import { MenuService, MenuStructure } from '../../menu.service';
import { CommandService } from '../../../command/command.service';
import { Menu } from '@grammyjs/menu';
import { MyContext } from '../../../tg-bot.service';

@Injectable()
export class ChooseFilterStateMenu extends MenuStructure {
  constructor(
    @Inject() private menuService: MenuService,
    @Inject() private commandService: CommandService,
  ) {
    super();
    this.createMenu();
    menuService.registerMenu('choose-filter-state-menu', this);
  }

  getMenu(): Menu<MyContext> {
    return this._menu;
  }

  createMenu() {
    this._menu = new Menu<MyContext>('choose-filter-state-menu')
      .text((ctx) => ctx.t('state.values', { value: 'all' }), async (ctx) => {
        await this.commandService.handle('set-filter-state', ctx, 'all');
      })
      .text((ctx) => ctx.t('state.values', { value: 'new' }), async (ctx) => {
        await this.commandService.handle('set-filter-state', ctx, 'new');
      })
      .text((ctx) => ctx.t('state.values', { value: 'used' }), async (ctx) => {
        await this.commandService.handle('set-filter-state', ctx, 'used');
      });
  }
}