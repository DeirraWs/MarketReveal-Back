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
        super();
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
            await ctx.reply(ctx.t("search-process-start"))
            try {
                ctx.session.searchData.searchParams.query = dialogData.searchName;
                ctx.session.searchData.data = await this.searchManager.searchProduct(dialogData.searchName);
                await ctx.reply(ctx.t("search-process-finish-success"))
                await this.commandService.handle("start-result-search",ctx)
                await this.end(ctx)
            } catch (e){
                await ctx.reply(ctx.t("search-process-finish-not-success"))
                await this.end(ctx)
            }
        }
    }
}