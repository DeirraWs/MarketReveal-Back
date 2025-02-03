import {Dialog, DialogService} from "../../tg-bot/dialog/dialog.service";
import {MyContext} from "../../tg-bot/tg-bot.service";
import {Inject, Injectable} from "@nestjs/common";
import {MenuService} from "../../tg-bot/menu/menu.service";
import {SearchManageService} from "../search-manage/search-manage.service";
import { CommandService } from '../../tg-bot/command/command.service';
import { OpenAIService } from '../../open-ai/open-ai.service';
import { ResultStructure, SearchResult } from '../types/types';

@Injectable()
export class SearchDialog extends Dialog {
    name = "search";

    constructor(
        @Inject() private searchManager: SearchManageService ,
        @Inject() private commandService: CommandService ,
        @Inject() private openai: OpenAIService,
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
                await this.commandService.handle('generate-filters-message', ctx);
                await this.end(ctx)
            } catch (e){
                console.log(e);
                await ctx.reply(ctx.t("search-process-finish-not-success"))
                await this.end(ctx)
            }
        }
    }
}