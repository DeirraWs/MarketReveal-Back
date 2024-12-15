// bot/bot.service.ts
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import {Bot, Context, session, SessionFlavor} from 'grammy';
import { MenuService } from './menu/menu.service';
import {DialogService} from "./dialog/dialog.service";
import * as process from "node:process";
import { AuthService } from 'src/auth/auth.service';

export interface MySession {
    activeDialog?: string;
    dialogData?: Record<string, any>;
    searchData?: Record<string, any>;
}

export type MyContext = Context & SessionFlavor<MySession>;

@Injectable()
export class TgBotService implements OnModuleInit {
    private bot: Bot<MyContext>;

    constructor(
       private readonly menuService: MenuService,
       private readonly dialogService: DialogService,
       private readonly authService: AuthService
    ) {
        this.bot = new Bot<MyContext>(process.env.TG_BOT_TOKEN);
    }

    onModuleInit() {

        this.menuService.getMenuClass("main-menu").getMenu()

        this.bot.use(session<MySession, MyContext>({
            initial: () => {
                console.log('Initializing session');
                return { activeDialog: undefined, dialogData: {} };
            }
        }));

        for (const menu of this.menuService.getAllMenuToRegisterInBot()) {
            this.bot.use(menu)
        }

        this.bot.command('start', async (ctx) => {
            const userInfo = this.authService.extractUserInfo(ctx);
            await this.authService.registration(ctx, userInfo);
            await ctx.reply('Welcome',{
                reply_markup: this.menuService.getMenuClass("main-menu").getMenu()
            });
        });

        this.bot.on("message", async (ctx) => {
            await this.dialogService.processMessage(ctx);
        });

        this.bot.catch((err) => {
            console.error('Error caught in bot:', err); // Вивести деталі помилки у консоль
        });

        this.bot.start();
    }
}


