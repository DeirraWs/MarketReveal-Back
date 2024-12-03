import {CommandService, Handler} from "../../tg-bot/command/command.service";
import {Injectable} from "@nestjs/common";
import {MyContext} from "../../tg-bot/tg-bot.service";
import {DialogService} from "../../tg-bot/dialog/dialog.service";

@Injectable()
export class SearchHandler extends Handler {

    constructor(
        private readonly command: CommandService,
        private readonly dialogService: DialogService,
    ) {
        super();
        command.addHandler("start-search",this)
    }

    async handlerLogic(context: MyContext): Promise<any> {
        await context.reply("Еnter the name of the product you want to find")
        await this.dialogService.startDialog(context,"search")
    }

}