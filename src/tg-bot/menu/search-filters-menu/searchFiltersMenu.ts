import { Inject, Injectable } from '@nestjs/common';
import { MenuService, MenuStructure } from '../menu.service';
import { Menu, MenuRange } from '@grammyjs/menu';
import { MyContext } from '../../tg-bot.service';
import { CommandService } from '../../command/command.service';
import { undefined } from 'zod';

@Injectable()

export class SearchFiltersMenu extends MenuStructure {

  constructor(
    @Inject() private menuService: MenuService,
    @Inject() private commandService: CommandService,
  ) {
    super();
    this.createMenu();
    menuService.registerMenu('search-search-properties-menu', this);
  }

  getMenu(): Menu<MyContext> {
    return this._menu;
  }

  createMenu() {
    this._menu = new Menu<MyContext>('search-properties-menu')
      .text(
        { text: ctx => ctx.t('minPrice') }, async (ctx) => {
          await this.commandService.handle('set-filter-min-price', ctx);
        },
      )
      .text({ text: ctx => ctx.t('maxPrice') }, async (ctx) => {
        await this.commandService.handle('set-filter-max-price', ctx);
      })
      .row()
      .dynamic(async (ctx: MyContext) => {
        const range = new MenuRange<MyContext>();

        range
          .text({ text: ctx => ctx.t('state') }, async (ctx) => {
            await this.commandService.handle('change-filter-state-menu-open', ctx);
          })
          .text({ text: ctx => ctx.t('Category') }, async (ctx) => {
            await this.commandService.handle('category-menu-open', ctx);
          })
          .row()

        if (ctx.session.searchData.searchParamsMenuState.subCategory.length > 0) {
          range
            .text({ text: ctx => ctx.t('SubCategory') },
              async (ctx) => {
                await this.commandService.handle('sub-category-menu-open', ctx);
              });
        }
        return range;
      })
      .row()
      .text({ text: ctx => ctx.t('search-process-start-button') }, async (ctx) => {
        await this.commandService.handle('start-search-ready', ctx);
      });
  }
}



@Injectable()
export class ChooseFilterSubCatMenu extends MenuStructure {
  constructor(
    @Inject() private menuService: MenuService,
    @Inject() private commandService: CommandService,
  ) {
    super();
    this.createMenu();
    menuService.registerMenu('category-menu', this);
  }

  getMenu(): Menu<MyContext> {
    return this._menu;
  }

  createMenu() {
    this._menu = new Menu<MyContext>('chose-filters-menu')
      .dynamic(async (ctx: MyContext) => {
        const range = new MenuRange<MyContext>();

        await this.commandService.handle('get-categories', ctx);

        for (const category of ctx.session.searchData.searchParamsMenuState.category) {
          range
            .text(
              (ctx: MyContext) => ctx.t('Category.values', { value: `${category.value}` }),
              async (ctx: MyContext) => {
                await this.commandService.handle('set-category', ctx, category);
              },
            )
            .row();
        }

        return range;
      });
  }
}

@Injectable()
export class SubCatMenu extends MenuStructure {
  constructor(
    @Inject() private menuService: MenuService,
    @Inject() private commandService: CommandService,
  ) {
    super();
    this.createMenu();
    menuService.registerMenu('sub-category-menu', this);
  }

  getMenu(): Menu<MyContext> {
    return this._menu;
  }

  createMenu() {
    this._menu = new Menu<MyContext>('sub-category-menu')
      .dynamic(async (ctx: MyContext) => {
        const range = new MenuRange<MyContext>();

        for (const category of ctx.session.searchData.searchParamsMenuState.subCategory) {
          range
            .text(
              (ctx: MyContext) => ctx.t('Category.values', { value: `${category.value}` }),
              async (ctx: MyContext) => {
                await this.commandService.handle('set-category', ctx, category);
              },
            )
            .row();
        }

        return range;
      });
  }
}