import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { FavouriteProduct } from "./model/favourite-product.model";
import { AddToFavouriteHandler } from "./addToFavouritesHandler";
import { CommandModule } from "src/tg-bot/command/command.module";
import { ViewFavouritesHandler } from "./viewFavouritesHandler";
import { DeleteFromFavouritesHandler } from "./deleteFromFavouritesHandler";
import { FavouriteProductService } from "./favouriteProductService";

@Module({
    imports: [
        SequelizeModule.forFeature([FavouriteProduct]),
        CommandModule
    ],
    providers: [AddToFavouriteHandler, ViewFavouritesHandler, DeleteFromFavouritesHandler, FavouriteProductService],
    exports: [AddToFavouriteHandler, ViewFavouritesHandler, DeleteFromFavouritesHandler],
})
export class FavouriteProductModule {}