import { CommandService, Handler } from "../tg-bot/command/command.service";
import { Injectable, Inject } from "@nestjs/common";
import { MyContext } from "../tg-bot/tg-bot.service";
import { FavouriteProduct } from "./model/favourite-product.model";
import { FavouriteProductService } from "./favouriteProductService";

@Injectable()
export class DeleteFromFavouritesHandler extends Handler {

    constructor(
        @Inject() private commandService: CommandService,
        private readonly favouriteProductSetvice: FavouriteProductService
    ) {
        super();
        commandService.addHandler("delete-from-favourites",this)
    }

    async handlerLogic(context: MyContext): Promise<void> {
        const telegramId = context.from?.id;
        
        const currentPage = context.session.searchData.paginationMenu.page
        
        const productData = this.favouriteProductSetvice.getProductFromPage(currentPage, context);

            try {
                const deleteCount = await FavouriteProduct.destroy({
                    where: {
                        telegramId,
                        title: productData.title,
                    },
                });
                if (deleteCount > 0) {
                    await context.reply(`Product "${productData.title}" has been removed from your favourites.`);
                } else {
                    await context.reply(`Product "${productData.title}" was not found in your favourites.`);
                }
            } catch (error) {
                console.error(error);
            }
    }
}