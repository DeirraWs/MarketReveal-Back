import {Inject, Injectable} from '@nestjs/common';
import {CommandService} from '../command/command.service';
import {Menu, MenuRange} from '@grammyjs/menu';
import {MyContext} from '../tg-bot.service';
import {MenuService, MenuStructure} from './menu.service';

@Injectable()
export class TrackingMenu extends MenuStructure {

    constructor(@Inject() private commandManagerService: CommandService,
                @Inject() private menuService: MenuService,) {
        super();
        this.createMenu()
        menuService.registerMenu("tracking-menu", this)
    }

    createMenu() {
        this._menu = new Menu<MyContext>('tracking-menu', {onMenuOutdated: false})
            .text((ctx: MyContext) => ctx.session.TrackingMenu.length !== 0 ? ctx.t("tracking-menu-choose") : ctx.t("tracking-menu-first-search"),
                () => {

                }).row()
            .dynamic(async (ctx: MyContext) => {
                const range = new MenuRange<MyContext>();

                const tracksData = await Promise.all(ctx.session.TrackingMenu.map(async (track) => {
                    return {
                        query: track.query,
                        uuid: track.uuid,
                        resultCount: await this.commandManagerService.handle("get-count-of-results-t", ctx, track.uuid)
                    }
                }));

                if (ctx.session.TrackingMenu.length === 0) {
                    range.text((ctx: MyContext) => ctx.t("tracking-menu-choose-search"),
                        async (ctx: MyContext) => {
                            await this.commandManagerService.handle("start-search", ctx)
                        });
                } else {
                    for (const data of tracksData) {
                        range.text({
                                text: (ctx: MyContext) => data.query + `${ctx.t("tracking-menu-count-of-results")}:${data.resultCount}`,
                            },
                            async (ctx: MyContext) => {
                                if (data.resultCount !== 0) {
                                    await this.commandManagerService.handle("get-t", ctx, data.uuid)
                                }
                            }
                        ).row()
                    }
                }
                range
                    .row()
                    .text((ctx: MyContext) => ctx.t("tracking-menu-update"),
                         (ctx) => {
                          ctx.menu.update()
                        }
                    )
                return range
            })

    }

    getMenu(): Menu<MyContext> {
        return this._menu;
    }

}