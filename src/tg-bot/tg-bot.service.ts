// bot/bot.service.ts
import {Injectable, OnModuleInit} from '@nestjs/common';
import {Bot, Context, session, SessionFlavor} from 'grammy';
import {MenuService} from './menu/menu.service';
import {DialogService} from "./dialog/dialog.service";
import {I18n, I18nFlavor} from "@grammyjs/i18n";
import * as process from "node:process";
import { AuthService } from 'src/auth/auth.service';
import { RoleGuard} from 'src/auth/guard/roles-guard';
import {CommandService} from "./command/command.service";

export interface SessionSearchData{
    dataTransformedToMenu: string[];
    data: any[];
    checkTrackedData: boolean;
    searchParams:{
        query: string;
        params:{};
    }
}

export interface MySession {
    activeDialog?: string;
    dialogData?: Record<string, any>;
    userInfo?: Record<string, any>;
    searchData?: SessionSearchData;
    TrackingMenu?: Array<{
        query: string;
        uuid: string;
        resultsCount:number;
    }>;
}

export type MyContext = Context & SessionFlavor<MySession> & I18nFlavor;

@Injectable()
export class TgBotService implements OnModuleInit {
    private bot: Bot<MyContext>;

    constructor(
       private readonly menuService: MenuService,
       private readonly dialogService: DialogService,
       private readonly authService: AuthService,
       private readonly roleGuard: RoleGuard,
        private readonly commandService: CommandService,
    ) {
        this.bot = new Bot<MyContext>(process.env.TG_BOT_TOKEN);
    }

    onModuleInit() {

        const i18n = new I18n<MyContext>({
            defaultLocale: "en",
            useSession: true,
            directory: "locales",
        });

        this.bot.use(session<MySession, MyContext>({
            initial: () => {
                console.log('Initializing session');
                return {
                    activeDialog: undefined,
                    dialogData: {},
                    searchData: {
                        dataTransformedToMenu: [],
                        data: [],
                        checkTrackedData:false,
                        searchParams:{
                            query:"",
                            params:{},
                        }
                    },
                    TrackingMenu:[],
                };
            }
        }));

        this.bot.use(i18n);

        this.initAllMenu();

        this.bot.command('start', async (ctx) => {
            const userInfo = this.authService.extractUserInfo(ctx);
            await this.authService.registration(ctx, userInfo);
            await ctx.reply(ctx.t("greeting"),{
                reply_markup: this.menuService.getMenuClass("main-menu").getMenu()
            });
        });

        //Тестова команда, для перевірки RoleGuard(Буде видалена)
        this.bot.command('access', async (ctx) => {
            await this.roleGuard.checkRoles(ctx, ['admin', 'moderator']) // Якщо в користувача є хоч одна з масиву, то доступ надається
            ctx.reply("Access granted")
        });

        this.bot.command('startT', async (ctx) => {
            await this.commandService.handle("start-t",ctx)
        });

        this.bot.command('stopT', async (ctx) => {
            await this.commandService.handle("stop-t",ctx)
        });

        this.bot.command('getT', async (ctx) => {
            await this.commandService.handle("get-t",ctx)
        })

        this.bot.on("message", async (ctx) => {
            await this.dialogService.processMessage(ctx);
        });

        this.bot.catch((err) => {
            console.error('Error caught in bot:', err); // Вивести деталі помилки у консоль
        });

        this.bot.start();
    }

    initAllMenu() {

        const mainMenu = this.menuService.getMenuClass("main-menu").getMenu()

        for (const menu of this.menuService.getAllMenuToRegisterInBot()) {
            mainMenu.register(menu.getMenu())
        }

        this.bot.use(mainMenu)
    }

}


