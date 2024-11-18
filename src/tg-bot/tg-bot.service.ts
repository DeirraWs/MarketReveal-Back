// bot/bot.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import {Bot, Context, session, SessionFlavor} from 'grammy';
import { MenuService } from './menu/menu.service';
import {DialogService} from "./dialog/dialog.service";
import * as process from "node:process";

export interface MySession {
    activeDialog?: string;
    dialogData?: Record<string, any>;
}

export type MyContext = Context & SessionFlavor<MySession>;

@Injectable()
export class TgBotService implements OnModuleInit {
    private bot: Bot<MyContext>;

    constructor(
       private readonly menuService: MenuService,
       private readonly dialogService: DialogService,
    ) {
        this.bot = new Bot<MyContext>(process.env.TG_BOT_TOKEN);
    }

    onModuleInit() {

        const menu = this.menuService.getMenu();

        this.bot.use(session<MySession, MyContext>({
            initial: () => {
                console.log('Initializing session');
                return { activeDialog: undefined, dialogData: {} };
            }
        }));

        this.bot.use(menu);

        this.bot.command('start', async (ctx) => {
            await ctx.reply('Вітаємо! Щоб отримати повний функціонал, будь ласка, зареєструйтесь.',{
                reply_markup:menu
            });

        });

        this.bot.on("message", async (ctx) => {
            await this.dialogService.processMessage(ctx);
        });

        this.bot.catch((err) => {
            console.error('Error caught in bot:', err); // Вивести деталі помилки у консоль
            if (err instanceof Error) {
                this.bot.api.sendMessage('<ADMIN_CHAT_ID>', `Error occurred: ${err.message}`);
            } else {
                this.bot.api.sendMessage('<ADMIN_CHAT_ID>', 'Unexpected error occurred in the bot!');
            }
        });

        this.bot.start();
    }
}


