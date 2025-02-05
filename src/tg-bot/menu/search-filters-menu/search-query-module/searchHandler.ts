import {CommandService, Handler} from "../../../command/command.service";
import {Inject, Injectable} from "@nestjs/common";
import {MyContext} from "../../../tg-bot.service";
import {DialogService} from "../../../dialog/dialog.service";
import {MenuService} from "../../menu.service";
import {SearchManageService} from "../../../../search/search-manage/search-manage.service";
import { SearchResult } from '../../../../search/types/types';
import { OpenAIService } from '../../../../open-ai/open-ai.service';

@Injectable()
export class SearchHandler extends Handler {

    constructor(
        private readonly command: CommandService,
        private readonly dialogService: DialogService,
        private readonly menuService: MenuService,
    ) {
        super();
        command.addHandler("start-search", this)
    }

    async handlerLogic(context: MyContext): Promise<any> {
        await context.reply(context.t("search-process-question"))
        await this.dialogService.startDialog(context, "search")
    }

}

@Injectable()
export class SearchReadyHandler extends Handler {

    constructor(
        private readonly commandService: CommandService,
        private readonly dialogService: DialogService,
        private readonly menuService: MenuService,
        private readonly searchManager: SearchManageService ,
        private readonly openai: OpenAIService,

    ) {
        super();
        commandService.addHandler("start-search-ready",this)
    }

    async handlerLogic(ctx: MyContext): Promise<any> {
        await ctx.reply(ctx.t("search-process-start"))
        ctx.session.searchData.data = await this.searchManager.searchProduct(ctx.session.searchData.searchParams.query, ctx.session.searchData.searchParams.filters);

        if ( ctx.session.searchData.data[0].res.length !== 0){
            //ctx.session.searchData.data =  await this.analyzeData( ctx.session.searchData.data,ctx.session.searchData.searchParams.query)
            await ctx.reply(ctx.t("search-process-finish-success"))
            await this.commandService.handle("start-pagination-menu",ctx)
        }  else {
            await ctx.reply(ctx.t("search-process-empty"));
            await this.commandService.handle("start-main-menu",ctx)
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