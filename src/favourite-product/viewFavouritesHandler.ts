import {CommandService, Handler} from "../tg-bot/command/command.service";
import {Injectable} from "@nestjs/common";
import {MyContext} from "../tg-bot/tg-bot.service";
import { FavouriteProductService } from "./favouriteProductService";

@Injectable()
export class ViewFavouritesHandler extends Handler {

    constructor(
        private readonly commandService: CommandService,
        private readonly favouriteProductService: FavouriteProductService
    ) {
        super();
        commandService.addHandler("view-favourite-products",this)
    }

    async handlerLogic(context: MyContext): Promise<void> {
        const telegramId = context.from?.id;
        
        const product = await this.favouriteProductService.getFavouriteProducts(telegramId, context);
        
        context.session.searchData.data = product;

        await this.commandService.handle('start-pagination-menu', context);
    }

}

