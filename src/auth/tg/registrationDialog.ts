import {Dialog, DialogService} from "../../tg-bot/dialog/dialog.service";
import {MyContext} from "../../tg-bot/tg-bot.service";
import {Injectable} from "@nestjs/common";
import {MenuService} from "../../tg-bot/menu/menu.service";

@Injectable()
export class RegistrationDialog extends Dialog {
    name = "registration";

    constructor(
        private readonly dialogService: DialogService,
        readonly menuService: MenuService,
    ) {
        super(menuService);
        dialogService.registerDialog(this)
    }

    async start(ctx: MyContext): Promise<void> {
        ctx.session.activeDialog = this.name;
        ctx.session.dialogData = {};
        await ctx.reply("Введіть ваше ім’я:");
    }

    async processMessage(ctx: MyContext): Promise<void> {
        const dialogData = ctx.session.dialogData;

        if (!dialogData.name) {
            dialogData.name = ctx.message?.text;
            await ctx.reply("Введіть ваш пароль:");
        } else if (!dialogData.password) {
            dialogData.password = ctx.message?.text;
            await ctx.reply("Введіть ваш email:");
        } else if (!dialogData.email) {
            dialogData.email = ctx.message?.text;
            await ctx.reply(
                `Реєстрація завершена! Ваші дані:\n- Ім’я: ${dialogData.name}\n- Email: ${dialogData.email}`
            );
            await this.end(ctx);
        }
    }
}