import { CommandService, Handler } from '../../tg-bot/command/command.service';
import { MyContext } from '../../tg-bot/tg-bot.service';
import { undefined } from 'zod';
import { Inject, Injectable } from '@nestjs/common';
import { DialogService } from '../../tg-bot/dialog/dialog.service';
import {MenuService, MenuStructure} from "../../tg-bot/menu/menu.service";

@Injectable()
export class MinPrice extends Handler{

    constructor(@Inject() commandService : CommandService,
                @Inject() private dialogService : DialogService
    ) {

        super();
        commandService.addHandler('set-filter-min-price', this);
    }

    async handlerLogic(context: MyContext): Promise<any> {
        await context.reply(context.t("minPrice.inputDesc"))
        await this.dialogService.startDialog(context,"get-filter-min-price")
    }

}

@Injectable()
export class MaxPrice extends Handler{

    constructor(@Inject() commandService : CommandService,
                @Inject() private dialogService : DialogService) {

        super();
        commandService.addHandler('set-filter-max-price', this);
    }

    async handlerLogic(context: MyContext): Promise<any> {
        await context.reply(context.t("maxPrice.inputDesc"))
        await this.dialogService.startDialog(context,"get-filter-max-price")
    }
}

@Injectable()
export class State extends Handler {

    constructor(@Inject() commandService: CommandService,
                private _commandService: CommandService,
                @Inject() private dialogService: DialogService) {

        super();
        commandService.addHandler('set-filter-state', this);
    }

    async handlerLogic(context: MyContext, state: string): Promise<any> {
        try {
            if (state){
                context.session.searchData.searchParams.filters["state"] = state;
            }
            await this._commandService.handle('generate-filters-message', context);

        } catch (e) {
            await context.reply(context.t("search-process-finish-not-success"))
        }
    }
}

@Injectable()
export class SubCat extends Handler {

    constructor(@Inject() commandService: CommandService,
                private _commandService: CommandService,
                @Inject() private dialogService: DialogService) {

        super();
        commandService.addHandler('set-filter-sub-cat', this);
    }

    async handlerLogic(context: MyContext, subCategory: string): Promise<any> {
        try {
            if (subCategory){
                context.session.searchData.searchParams.filters["subCategory"] = subCategory;
            }
            await this._commandService.handle('generate-filters-message', context);

        } catch (e) {
            await context.reply(context.t("search-process-finish-not-success"))
        }
    }
}

@Injectable()
export class SendFiltersMessage extends Handler{

    constructor(@Inject() commandService : CommandService,
                @Inject() private dialogService : DialogService,
                private readonly menuService: MenuService
    )
    {
        super();
        commandService.addHandler('generate-filters-message', this);
    }

    private generateMessage(context: MyContext): string {
        try {
            const filters = context.session.searchData.searchParams.filters || {};
            if (typeof filters !== 'object' || Array.isArray(filters)) {
                console.error("Filters should be an object");
                return context.t("search-process-finish-not-success");
            }

            let message = `${context.t("search-filters-message-header")}:\n`;
            const sortedFilters = Object.keys(filters).sort();
            for (const filter of sortedFilters) {
                message += `${context.t(String(filter))}: ${context.t(`${filter}.values`, {value: String(filters[filter])})}\n`;
            }


            return message;
        } catch (error) {
            console.error("Error generating message:", error);
            return context.t("search-process-finish-not-success");
        }
    }

    async handlerLogic(context: MyContext): Promise<any> {
        await context.reply(`${this.generateMessage(context)}`,{
            reply_markup: this.menuService.getMenuClass("search-filters-menu").getMenu()
        });
    }
}

@Injectable()
export class OpenSetFilterStateMenu extends Handler{

    constructor(@Inject() commandService : CommandService,
                @Inject() private dialogService : DialogService,
                private readonly menuService: MenuService
    )
    {
        super();
        commandService.addHandler('change-filter-state-menu-open', this);
    }

    async handlerLogic(context: MyContext): Promise<any> {
        await context.reply(context.t("state.inputDesc"),{
            reply_markup: this.menuService.getMenuClass("choose-filter-state-menu").getMenu()
        });
    }
}

@Injectable()
export class OpenSetFilterSubCatMenu extends Handler{

    constructor(@Inject() commandService : CommandService,
                @Inject() private dialogService : DialogService,
                private readonly menuService: MenuService
    )
    {
        super();
        commandService.addHandler('change-filter-sub-cat-menu-open', this);
    }

    async handlerLogic(context: MyContext): Promise<any> {
        await context.reply(context.t("subCategory.inputDesc"),{
            reply_markup: this.menuService.getMenuClass("choose-filter-sub-cat-menu").getMenu()
        });
    }
}
