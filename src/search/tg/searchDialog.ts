import {Dialog, DialogService} from "../../tg-bot/dialog/dialog.service";
import {MyContext} from "../../tg-bot/tg-bot.service";
import {Inject, Injectable} from "@nestjs/common";
import {MenuService} from "../../tg-bot/menu/menu.service";
import {SearchManageService} from "../search-manage/search-manage.service";
import { CommandService } from '../../tg-bot/command/command.service';

@Injectable()
export class SearchDialog extends Dialog {
    name = "search";

    constructor(
        @Inject() private searchManager: SearchManageService ,
        @Inject() private commandService: CommandService ,
        private readonly dialogService: DialogService,
        readonly menuService: MenuService,
    ) {
        super(menuService);
        dialogService.registerDialog(this)
    }

    async start(ctx: MyContext): Promise<void> {
        ctx.session.activeDialog = this.name;
        ctx.session.dialogData = {};
    }

    async processMessage(ctx: MyContext): Promise<void> {
        const dialogData = ctx.session.dialogData;

        if (!dialogData.searchName) {
            dialogData.searchName = ctx.message?.text;
            await ctx.reply("⏳ Процес розпочато, зачекайте...")
            try {
                ctx.session.dialogData.res = await this.searchManager.searchProduct(dialogData.searchName);
                await ctx.reply("✅ Процес завершено успішно!")
                await this.commandService.handle("start-result-search",ctx)
            } catch (e){
                await ctx.reply("Процес завершено з помилкою")
                await this.end(ctx)
            }
        }
    }
}