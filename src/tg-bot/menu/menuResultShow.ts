import { Menu } from '@grammyjs/menu';
import { Context } from 'grammy';
import { MyContext } from '../tg-bot.service';
import { Inject, Injectable } from '@nestjs/common';
import { CommandService } from '../command/command.service';

@Injectable()
export default class MenuPagination {

  constructor(@Inject() private commandService: CommandService) {

  }

  private _menu: Menu<MyContext> | null = null;

  getMenu(){
    return this._menu;
  }

  createNewMenu() {
    this._menu = new Menu<MyContext>('pagination-menu', { onMenuOutdated: false })
      .text(
        { text: '← Previous', payload: (ctx) => this._pageMovement(false, ctx.match,ctx) },
        async (ctx) => {
          const newPayload = this._parsePayload(String(ctx.match));
          if (newPayload.prevPayload !== newPayload.payload) {
            await ctx.editMessageText(this._getItemText(newPayload.payload,ctx), {
              reply_markup: this._menu,
            });
          }
        },
      )
      .text(
        { text: 'Next →', payload: (ctx) => this._pageMovement(true, ctx.match,ctx) },
        async (ctx) => {
          const newPayload = this._parsePayload(String(ctx.match));
          if (newPayload.prevPayload !== newPayload.payload) {
            await ctx.editMessageText(this._getItemText(newPayload.payload,ctx), {
              reply_markup: this._menu,
            });
          }
        },
      ).row()
      .text(
        {
          text: ctx => ctx.from && this._parsePayload(String(ctx.match)).extended ? 'Back' : 'More info',
          payload:(ctx)=> this._toggleButton(ctx),
        },
        async (ctx) => {
          const newPayload = this._parsePayload(String(ctx.match));
          if (newPayload.extended) {
            await ctx.editMessageText(`Extended info of ${this._getItemText(newPayload.payload,ctx)}`, {
              reply_markup: this._menu,
            });
          } else {
            await ctx.editMessageText(`${this._getItemText(newPayload.payload,ctx)}`, {
              reply_markup: this._menu,
            });
          }
        },
      ).row()
      .text("Припинити перегляд", async (ctx) => {
          await this.commandService.handle("stop-result-search",ctx)
      })
  }

  getStartInfo(context: MyContext) {
    return ` 1/${context.session.searchData.res.length}  \n` + context.session.searchData.res[0];
  }

  private _getItemText(index: number,context:MyContext): string {
    return ` ${index+1}/${context.session.searchData.res.length}  \n` + context.session.searchData.res[index];
  }

  private _pageMovement(next: boolean, prevValue: string | RegExpMatchArray | undefined,ctx:MyContext): string {
    const parsePayloadL = this._parsePayload(String(prevValue));
    const tmp = parsePayloadL.payload;
    if (next) {
      if (tmp + 1 < ctx.session.searchData.res.length) {
        return this._createPayload({
          prevPayload: parsePayloadL.payload,
          payload: parsePayloadL.payload + 1,
          extended: parsePayloadL.extended,
        });
      } else {
        return this._createPayload({
          prevPayload: parsePayloadL.payload,
          payload: parsePayloadL.payload,
          extended: parsePayloadL.extended,
        });
      }
    } else if (tmp - 1 >= 0) {
      return this._createPayload({
        prevPayload: parsePayloadL.payload,
        payload: parsePayloadL.payload - 1,
        extended: parsePayloadL.extended,
      });
    } else {
      return this._createPayload({
        prevPayload: parsePayloadL.payload,
        payload: parsePayloadL.payload,
        extended: parsePayloadL.extended,
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
      });
    } else {
      return this._createPayload({
        prevPayload: payloadP.prevPayload,
        payload: payloadP.payload,
        extended: true,
      });
    }
  }

  private _createPayload(input: { prevPayload: number; payload: number; extended: boolean }): string {
    return `${input.prevPayload} ${input.payload} ${input.extended ? 't' : 'f'}`;
  }

  private _parsePayload(input: string|undefined): { prevPayload: number; payload: number; extended: boolean } {

    if (input === "undefined") {
      return {
        prevPayload: 0,
        payload: 0,
        extended: false,
      };
    }

    if (input.length === 0) {
      return {
        prevPayload: 0,
        payload: 0,
        extended: false,
      };
    }

    const parts = input.split(' ');

    // Розпарсити значення
    const prevPayload = parseInt(parts[0], 10);
    const payload = parseInt(parts[1], 10);
    const extended = parts[2] === 't';

    return { prevPayload, payload, extended };
  }
}