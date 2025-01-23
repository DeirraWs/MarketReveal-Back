import { Inject, Injectable } from '@nestjs/common';
import { MenuService, MenuStructure } from './menu.service';
import { Menu } from '@grammyjs/menu';
import { MyContext } from '../tg-bot.service';
import { CommandService } from '../command/command.service';
import {undefined} from "zod";

@Injectable()

export class SearchFiltersMenu extends MenuStructure {

    constructor(
        @Inject() private menuService: MenuService,
        @Inject() private commandService: CommandService,
    ) {
        super();
        this.createMenu();
        menuService.registerMenu('search-filters-menu', this);
    }

    getMenu(): Menu<MyContext> {
        return this._menu;
    }

    createMenu() {
        this._menu = new Menu<MyContext>('search-filters-menu')
            .text(
                { text: ctx => ctx.t('minPrice') }, async (ctx) => {
                    await this.commandService.handle('set-filter-min-price', ctx);
                },
            )
            .text({ text: ctx => ctx.t('maxPrice') }, async (ctx) => {
                await this.commandService.handle('set-filter-max-price', ctx);
            })
            .row()
            .text({ text: ctx => ctx.t('state') }, async (ctx) => {
                await this.commandService.handle('change-filter-state-menu-open', ctx);
            })
            .text({ text: ctx => ctx.t('subCategory') }, async (ctx) => {
                await this.commandService.handle('change-filter-sub-cat-menu-open', ctx);
            })
            .row()
            .text({ text: ctx => ctx.t('search-process-start-button') }, async (ctx) => {
                await this.commandService.handle('start-search-ready', ctx);
            });
    }
}

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
            .text((ctx)=>ctx.t("state.values", {value: "all"}), async (ctx) => {
                await this.commandService.handle('set-filter-state', ctx, 'all');
            })
            .text((ctx)=>ctx.t("state.values", {value: "new"}), async (ctx) => {
                await this.commandService.handle('set-filter-state', ctx, 'new');
            })
            .text((ctx)=>ctx.t("state.values", {value: "used"}), async (ctx) => {
                await this.commandService.handle('set-filter-state', ctx, 'used');
            })
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
        menuService.registerMenu('choose-filter-sub-cat-menu', this);
    }

    getMenu(): Menu<MyContext> {
        return this._menu;
    }

    createMenu() {
        this._menu = new Menu<MyContext>('choose-filter-sub-cat-menu')
            .text((ctx)=>ctx.t("subCategory.values", {value: "all"}), async (ctx) => {
                await this.commandService.handle('set-filter-sub-cat', ctx, 'all');
            })
            .row()
            .text((ctx)=>ctx.t("subCategory.values", {value: "mobilnye-telefony-smartfony"}), async (ctx) => {
                await this.commandService.handle('set-filter-sub-cat', ctx, '85');
            })
            .row()
            .text((ctx)=>ctx.t("subCategory.values", {value: "zapchasti-dlya-telefonov"}), async (ctx) => {
                await this.commandService.handle('set-filter-sub-cat', ctx, '1482');
            })
            .row()
            .text((ctx)=>ctx.t("subCategory.values", {value: "aksessuary-dlya-telefonov"}), async (ctx) => {
                await this.commandService.handle('set-filter-sub-cat', ctx, '442');
            })
    }
}