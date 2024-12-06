import { Inject, Injectable } from '@nestjs/common';
import { CommandService, Handler } from '../command/command.service';
import { Menu } from '@grammyjs/menu';
import { MyContext } from '../tg-bot.service';
import { MenuService, MenuStructure } from './menu.service';

class HelpHandler extends Handler{
  async handlerLogic(context: MyContext): Promise<any> {
     await context.reply("Do you want help? Ask God")
  }
}

@Injectable()
export class MainMenu extends MenuStructure {

  constructor(@Inject() private commandManagerService: CommandService,
              @Inject() menuService: MenuService, ) {
    super();
    this.creteMenu()
    menuService.registerMenu("main-menu",this)
  }

  creteMenu() {
    this.commandManagerService.addHandler("help",new HelpHandler)

    this._menu = new Menu<MyContext>("main-menu")
      .text('Синоніми', async (ctx) => {
        await this.commandManagerService.handle("search-synonyms",ctx);
      })
      .text('Допомога' , async (ctx) => {
        await this.commandManagerService.handle("help",ctx);
      })
      .text("Пошук", async (ctx) => {
        await this.commandManagerService.handle("start-search",ctx);
      })
  }

  getMenu(): Menu<MyContext> {
    return this._menu;
  }

}