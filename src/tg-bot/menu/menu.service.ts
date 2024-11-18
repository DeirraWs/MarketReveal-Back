// menu/menu.service.ts
import { Injectable } from '@nestjs/common';
import { Menu } from '@grammyjs/menu';
import { Context } from 'grammy';
import { CommandService,Handler } from '../command/command.service';
import {MyContext} from "../tg-bot.service";

class HelpHandler extends Handler {

    async handlerLogic(context: Context): Promise<any> {
        await context.reply("Help is her")
    }

}

@Injectable()
export class MenuService {
    private menu: Menu<MyContext>;

    constructor(private readonly commandManagerService: CommandService) {
        this.menu = new Menu("main-menu");
        this.createMenu();
    }

    createMenu() {

        this.commandManagerService.addHandler("help",new HelpHandler)

        this.menu
            .text('Реєстрація', async (ctx) => {
                await this.commandManagerService.handle("registration",ctx);
            })
            .text('Допомога' , async (ctx) => {
                await this.commandManagerService.handle("help",ctx);
            });
    }

    getMenu(): Menu {
        return this.menu;
    }
}