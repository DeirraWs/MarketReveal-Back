import {Menu} from '@grammyjs/menu';
import {Context} from 'grammy';
import {MyContext} from '../tg-bot.service';
import {Inject, Injectable} from '@nestjs/common';
import {CommandService} from '../command/command.service';
import {MenuService, MenuStructure} from './menu.service';

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
                    payload: (ctx) => this._pageMovement(false, ctx.match, ctx)
                },
                async (ctx) => {
                    const newPayload = this._parsePayload(String(ctx.match));
                    if (newPayload.prevPayload !== newPayload.payload) {
                        await ctx.editMessageText(this._getItemText(newPayload.payload, ctx), {
                            reply_markup: this._menu,
                        });
                    }
                },
            )
            .text(
                {
                    text: ctx => ctx.t("menu_result_show_next_btn"),
                    payload: (ctx) => this._pageMovement(true, ctx.match, ctx)
                },
                async (ctx) => {
                    const newPayload = this._parsePayload(String(ctx.match));
                    if (newPayload.prevPayload !== newPayload.payload) {
                        await ctx.editMessageText(this._getItemText(newPayload.payload, ctx), {
                            reply_markup: this._menu,
                        });
                    }
                },
            ).row()
            .text(
                {
                    text: ctx => ctx.from && this._parsePayload(String(ctx.match)).extended ? ctx.t("menu_result_show_normal_btn") : ctx.t("menu_result_show_extended_btn"),
                    payload: (ctx) => this._toggleButton(ctx),
                },
                async (ctx) => {
                    const newPayload = this._parsePayload(String(ctx.match));
                    if (newPayload.extended) {
                        await ctx.editMessageText(`Extended info of ${this._getItemText(newPayload.payload, ctx)}`, {
                            reply_markup: this._menu,
                        });
                    } else {
                        await ctx.editMessageText(`${this._getItemText(newPayload.payload, ctx)}`, {
                            reply_markup: this._menu,
                        });
                    }
                },
            ).row()
            .text({
                text: ctx => ctx.from && this._parsePayload(String(ctx.match)).tracked ? ctx.t("menu_result_show_tracked_btn") : ctx.t("menu_result_show_track_btn"),
                payload: ctx =>  this._toggleButton1(ctx)
            },
                async (ctx) => {
                    const newPayload = this._parsePayload(String(ctx.match));
                    console.log(newPayload.tracked);
                    if (newPayload.tracked) {
                        await this.commandService.handle('start-t', ctx);
                    }
                    ctx.menu.update()
                })
            .row()
            .text(ctx => ctx.t("menu_result_show_stop_btn"), async (ctx) => {
                await this.commandService.handle("stop-result-search", ctx)
            })
    }

    getStartInfo(context: MyContext) {
        return ` 1/${context.session.searchData.dataTransformedToMenu.length}  \n` + context.session.searchData.dataTransformedToMenu[0];
    }

    private _getItemText(index: number, context: MyContext): string {
        return ` ${index + 1}/${context.session.searchData.dataTransformedToMenu.length}  \n` + context.session.searchData.dataTransformedToMenu[index];
    }

    private _pageMovement(next: boolean, prevValue: string | RegExpMatchArray | undefined, ctx: MyContext): string {
        const parsePayloadL = this._parsePayload(String(prevValue));
        const tmp = parsePayloadL.payload;
        if (next) {
            if (tmp + 1 < ctx.session.searchData.dataTransformedToMenu.length) {
                return this._createPayload({
                    prevPayload: parsePayloadL.payload,
                    payload: parsePayloadL.payload + 1,
                    extended: parsePayloadL.extended,
                    tracked: parsePayloadL.tracked
                });
            } else {
                return this._createPayload({
                    prevPayload: parsePayloadL.payload,
                    payload: parsePayloadL.payload,
                    extended: parsePayloadL.extended,
                    tracked: parsePayloadL.tracked
                });
            }
        } else if (tmp - 1 >= 0) {
            return this._createPayload({
                prevPayload: parsePayloadL.payload,
                payload: parsePayloadL.payload - 1,
                extended: parsePayloadL.extended,
                tracked: parsePayloadL.tracked
            });
        } else {
            return this._createPayload({
                prevPayload: parsePayloadL.payload,
                payload: parsePayloadL.payload,
                extended: parsePayloadL.extended,
                tracked: parsePayloadL.tracked
            });
        }
    }

    private _toggleButton(payload: Context): string {
        const payloadP = this._parsePayload(String(payload.match));

        if (payloadP.extended) {
            return this._createPayload({
                prevPayload: payloadP.prevPayload,
                payload: payloadP.payload,
                extended: false,
                tracked: payloadP.tracked
            });
        } else {
            return this._createPayload({
                prevPayload: payloadP.prevPayload,
                payload: payloadP.payload,
                extended: true,
                tracked: payloadP.tracked
            });
        }
    }

    private _toggleButton1(payload: Context): string {
        const payloadP = this._parsePayload(String(payload.match));

        if (payloadP.tracked) {
            return this._createPayload({
                prevPayload: payloadP.prevPayload,
                payload: payloadP.payload,
                extended: payloadP.extended,
                tracked: false
            });
        } else {
            return this._createPayload({
                prevPayload: payloadP.prevPayload,
                payload: payloadP.payload,
                extended: payloadP.extended,
                tracked: true
            });
        }
    }

    private _createPayload(input: {
        prevPayload: number;
        payload: number;
        extended: boolean;
        tracked: boolean
    }): string {
        return `${input.prevPayload} ${input.payload} ${input.extended ? 't' : 'f'} ${input.tracked ? 't' : 'f'}`;
    }

    private _parsePayload(input: string | undefined): {
        prevPayload: number;
        payload: number;
        extended: boolean;
        tracked: boolean
    } {

        if (input === "undefined") {
            return {
                prevPayload: 0,
                payload: 0,
                extended: false,
                tracked: false,
            };
        }

        if (input.length === 0) {
            return {
                prevPayload: 0,
                payload: 0,
                extended: false,
                tracked: false
            };
        }

        const parts = input.split(' ');

        // Розпарсити значення
        const prevPayload = parseInt(parts[0], 10);
        const payload = parseInt(parts[1], 10);
        const extended = parts[2] === 't';
        const tracked = parts[3] === 't'

        return {prevPayload, payload, extended, tracked};
    }
}