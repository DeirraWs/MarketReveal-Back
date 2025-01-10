import {Inject, Injectable} from '@nestjs/common';
import {CommandService, Handler} from '../command/command.service';
import {Menu} from '@grammyjs/menu';
import {MyContext} from '../tg-bot.service';
import {MenuService, MenuStructure} from './menu.service';

class HelpHandler extends Handler {
    async handlerLogic(context: MyContext): Promise<any> {
        await context.reply("Do you want help? Ask God")
    }
}

@Injectable()
export class MainMenu extends MenuStructure {

    constructor(@Inject() private commandManagerService: CommandService,
                @Inject() private menuService: MenuService,) {
        super();
        this.createMenu()
        menuService.registerMenu("main-menu", this)
    }

    createMenu() {
        this.commandManagerService.addHandler("help", new HelpHandler)

        this._menu = new Menu<MyContext>("main-menu")
            .text({text: ctx => ctx.t("main_menu_search_btn")}, async (ctx) => {
                await this.commandManagerService.handle("start-search", ctx);
            })
            .text({text: ctx => ctx.t("main_menu_tracking_btn")}, async (ctx) => {
                await ctx.reply("Da",{
                    reply_markup: this.menuService.getMenuClass("tracking-menu").getMenu()
                })
            })
            .row()
            .text({text: ctx => ctx.t("main_menu_account1_btn")}, async (ctx) => {
                await this.commandManagerService.handle("account-open", ctx);
            })
            .text({text: ctx => ctx.t("main_menu_help_btn")}, async (ctx) => {
                await this.commandManagerService.handle("help", ctx);
            })
            .row()
            .text({text: ctx => ctx.t("main_menu_account_btn")}, async (ctx) => {
                await this.commandManagerService.handle("search-synonyms", ctx);
            })
            .text(
                { text: ctx => ctx.t('main_menu_view_favourite_products_btn') }, async (ctx) => {
                  await this.commandManagerService.handle('view-favourite-products', ctx);
                },
              ).row()
    }

    getMenu(): Menu<MyContext> {
        return this._menu;
    }

}