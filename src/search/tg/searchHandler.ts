import {CommandService, Handler} from "../../tg-bot/command/command.service";
import {Inject, Injectable} from "@nestjs/common";
import {MyContext} from "../../tg-bot/tg-bot.service";
import {DialogService} from "../../tg-bot/dialog/dialog.service";
import {MenuService} from "../../tg-bot/menu/menu.service";
import {SearchManageService} from "../search-manage/search-manage.service";

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
        private readonly command: CommandService,
        private readonly dialogService: DialogService,
        private readonly menuService: MenuService,
        private readonly searchManager: SearchManageService ,

    ) {
        super();
        command.addHandler("start-search-ready",this)
    }

    async handlerLogic(context: MyContext): Promise<any> {
        await context.reply(context.t("search-process-start"))

        await this.dialogService.startDialog(context, "search")
        context.session.searchData.searchParams.filters = {}
        context.session.searchData.data = await this.searchManager.searchProduct(context.session.searchData.searchParams.query);
        await context.reply(context.t("search-process-finish-success"))
        await this.command.handle("start-pagination-menu", context)

    }
}