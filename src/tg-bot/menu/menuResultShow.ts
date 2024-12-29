import {Menu} from '@grammyjs/menu';
import {MyContext} from '../tg-bot.service';
import {Inject, Injectable} from '@nestjs/common';
import {CommandService} from '../command/command.service';
import {MenuService, MenuStructure} from './menu.service';

const MAX_MESSAGE_LENGTH = 4096;

@Injectable()
export default class MenuPagination extends MenuStructure {

    constructor(@Inject() private commandService: CommandService,
                @Inject() private menuService: MenuService,) {
        super();
        this.createMenu()
        menuService.registerMenu("menu-pagination", this)
    }

    getMenu(): Menu<MyContext> {
        return this._menu;
    }

    createMenu() {
        this._menu = new Menu<MyContext>('pagination-menu', {onMenuOutdated: false})
            .text(
                {
                    text: ctx => ctx.t("menu_result_show_prev_btn"),
                },
                async (ctx) => {
                    if (this._pageMovement(ctx,false)) {
                        await ctx.editMessageText(this._getItemText(ctx.session.searchData.paginationMenu.page, ctx), {
                            reply_markup: this._menu,
                        });
                    }
                },
            )
            .text(
                {
                    text: ctx => ctx.t("menu_result_show_next_btn"),
                },
                async (ctx : MyContext) => {
                    if (this._pageMovement(ctx,true)) {
                        await ctx.editMessageText(this._getItemText(ctx.session.searchData.paginationMenu.page, ctx), {
                            reply_markup: this._menu,
                        });
                    }
                },
            ).row()
            .text(
                {
                    text: ctx => ctx.session.searchData.paginationMenu.additionalData[0] ? ctx.t("menu_result_show_normal_btn") : ctx.t("menu_result_show_extended_btn"),
                },
                async (ctx) => {
                    if (this._toggleButton(ctx,0)) {
                        await ctx.editMessageText(`Extended info of ${this._getItemText(ctx.session.searchData.paginationMenu.page, ctx)}`, {
                            reply_markup: this._menu,
                        });
                    } else {
                        await ctx.editMessageText(`${this._getItemText(ctx.session.searchData.paginationMenu.page,ctx)}`, {
                            reply_markup: this._menu,
                        });
                    }
                },
            ).row()
            .text({
                text: ctx => ctx.session.searchData.paginationMenu.additionalData[1] ? ctx.t("menu_result_show_tracked_btn") : ctx.t("menu_result_show_track_btn"),
            },
                async (ctx) => {
                    if (this._toggleButton(ctx,1)) {
                        await this.commandService.handle('start-t', ctx, ctx.session.searchData.searchParams);
                    }
                    ctx.menu.update()
                })
            .row()
            .text({
                text: ctx => ctx.session.searchData.paginationMenu.additionalData[2] ? "❤️" : "🤍",
            }, async (ctx) => {
                if (this._toggleButton(ctx,2)){
                    //await this.commandService.handle('', ctx);
                } else {
                    //await this.commandService.handle('', ctx);
                }
                ctx.menu.update();
            })
            .row()
            .text(ctx => ctx.t("menu_result_show_stop_btn"), async (ctx) => {
                await this.commandService.handle("stop-result-search", ctx)
            })
    }

    getStartInfo(context: MyContext): string {
        return ` 1/${context.session.searchData.dataTransformedToMenu.length}  \n` + context.session.searchData.dataTransformedToMenu[0];
    }

    private _getItemText(index: number, context: MyContext): string {
        return ` ${index + 1}/${context.session.searchData.dataTransformedToMenu.length}  \n` + this._checkMessageToLongReturnShorter(context.session.searchData.dataTransformedToMenu[index]);
    }

    private _checkMessageToLongReturnShorter(text): string {
        if (text.length > MAX_MESSAGE_LENGTH) {
            return  text.slice(0, MAX_MESSAGE_LENGTH - 3) + "...";
        }
        return text;
    }

    private _pageMovement(ctx:MyContext,next: boolean): boolean {
        if (next){
            if (this._checkBorders(ctx.session.searchData.paginationMenu.page+1,ctx)) {
                ctx.session.searchData.paginationMenu.page++;
                return true;
            }
        } else {
            if (this._checkBorders(ctx.session.searchData.paginationMenu.page+1,ctx)) {
                ctx.session.searchData.paginationMenu.page--;
                return true;
            }
        }
        return false;
    }

    private _checkBorders(nextPage: number, ctx: MyContext ):boolean {
        return  nextPage >= 0 && nextPage <= ctx.session.searchData.dataTransformedToMenu.length
    }

    private _toggleButton(ctx:MyContext,indexInAdditionalData:number) : boolean{
        return  ctx.session.searchData.paginationMenu.additionalData[indexInAdditionalData] = !ctx.session.searchData.paginationMenu.additionalData[indexInAdditionalData];
    }

}