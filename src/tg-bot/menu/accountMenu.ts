import { Inject, Injectable } from '@nestjs/common';
import { MenuService, MenuStructure } from './menu.service';
import { Menu } from '@grammyjs/menu';
import { MyContext } from '../tg-bot.service';
import { CommandService } from '../command/command.service';

@Injectable()

export class AccountMenu extends MenuStructure {

  constructor(
    @Inject() private menuService: MenuService,
    @Inject() private commandService: CommandService,
  ) {
    super();
    this.createMenu();
    menuService.registerMenu('account-menu', this);
  }

  getMenu(): Menu<MyContext> {
    return this._menu;
  }

  createMenu() {
    this._menu = new Menu<MyContext>('account-menu')
      .text(
        { text: ctx => ctx.t('menu_account_change_language_btn') }, async (ctx) => {
          await this.commandService.handle('change-language-menu-open', ctx);
        },
      ).row()
      .text({ text: ctx => ctx.t('menu_account_back_btn') }, async (ctx) => {
        await this.commandService.handle('account-close', ctx);
      });
  }
}

@Injectable()
export class ChangeLanguageMenu extends MenuStructure {
  constructor(
    @Inject() private menuService: MenuService,
    @Inject() private commandService: CommandService,
  ) {
    super();
    this.createMenu();
    menuService.registerMenu('change-language-menu', this);
  }

  getMenu(): Menu<MyContext> {
    return this._menu;
  }

  createMenu() {
    this._menu = new Menu<MyContext>('change-language-menu')
      .text('🇺🇦 Українська', async (ctx) => {
        await this.commandService.handle('language-change', ctx, 'ua');
      })
      .text('🇬🇧 English', async (ctx) => {
        await this.commandService.handle('language-change', ctx, 'en');
      })
      .text('🇨🇳 中文', async (ctx) => {
        await this.commandService.handle('language-change', ctx, 'zh');
      });
  }
}