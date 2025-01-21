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
                ctx.session.searchData.data = await this.searchManager.searchProduct(dialogData.searchName);

                if ( ctx.session.searchData.data[0].res.length !== 0){
                    ctx.session.searchData.data =  await this.analyzeData( ctx.session.searchData.data,dialogData.searchName)
                    await ctx.reply(ctx.t("search-process-finish-success"))
                    await this.commandService.handle("start-pagination-menu",ctx)
                }  else {
                    await ctx.reply(ctx.t("search-process-empty"));
                    await this.commandService.handle("start-main-menu",ctx)
                }

                await this.end(ctx)
            } catch (e){
                console.log(e);
                await ctx.reply(ctx.t("search-process-finish-not-success"))
                await this.end(ctx)
            }
        }
    }

    async analyzeData(offers : SearchResult[], query: string): Promise<SearchResult[]> {

        let indexes :number[] =  await this.openai.analyzeOffersByNameSuitabilityToQuery(offers[0].res.map((value)=> {return value.title}),query)

        let sortedOffers = [];

        for (const index of indexes) {
            sortedOffers.push(offers[0].res[index]);
        }

        return  [{
            res: sortedOffers,
            resultCode:1
        }]
    }


}