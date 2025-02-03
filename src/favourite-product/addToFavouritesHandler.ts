import { CommandService, Handler } from "../tg-bot/command/command.service";
import { Injectable, Inject } from "@nestjs/common";
import { MyContext } from "../tg-bot/tg-bot.service";
import { FavouriteProduct } from "./model/favourite-product.model";
import { FavouriteProductService } from "./favouriteProductService";

@Injectable()
export class AddToFavouriteHandler extends Handler {

    constructor(
        @Inject() private commandService: CommandService,
        private readonly favouriteProductService: FavouriteProductService
    ) {
        super();
        commandService.addHandler("add-to-favourite",this)
    }

    async handlerLogic(context: MyContext): Promise<void> {
        const telegramId = context.from?.id;
        
        const currentPage = context.session.searchData.paginationMenu.page
        
        const productData = this.favouriteProductService.getProductFromPage(currentPage, context);

        const exists = await this.favouriteProductService.doesRecordExist(telegramId, productData.title);
        
        if (exists) {
            await context.reply("Already in favourites")
        }
        else{
            try {
                await FavouriteProduct.create({
                    telegramId,
                    title: productData.title,
                    price: productData.price.amount,
                    currency: productData.price.currency,
                    timePosted: productData.timePosted,
                    url: productData.url,
                    tags: productData.tags.join(', '),
                    description: productData.description || context.t('no_description_text'),
                });
            } catch (error) {
                console.error(error);
            }
    
        }
    }  
}