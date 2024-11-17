// bot/bot.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Bot } from 'grammy';
import { MenuService } from './menu/menu.service';
import * as process from "node:process";

@Injectable()
export class TgBotService implements OnModuleInit {
    private bot: Bot;

    constructor(
       private readonly menuService: MenuService,
    ) {
        this.bot = new Bot(process.env.TG_BOT_TOKEN);
    }

    onModuleInit() {

        const menu = this.menuService.getMenu();

        this.bot.use(menu);

        this.bot.command('start', async (ctx) => {
            await ctx.reply('Вітаємо! Щоб отримати повний функціонал, будь ласка, зареєструйтесь.',{
                reply_markup:menu
            });

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


