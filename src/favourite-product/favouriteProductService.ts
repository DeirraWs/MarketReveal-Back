import { Injectable } from "@nestjs/common";
import { FavouriteProduct } from "./model/favourite-product.model";
import { MyContext } from "../tg-bot/tg-bot.service";
import { SearchResult, ResultStructure } from "src/search/types/types";

@Injectable()
export class FavouriteProductService {
    getProductFromPage(pageIndex: number, context: MyContext): ResultStructure | null {
        const formattedData = this.createCorrectFormatOfResult(context.session.searchData.data);

        if (pageIndex < 0 || pageIndex >= formattedData.length) {
            console.error("Invalid page index");
            return null;
        }

        return formattedData[pageIndex];
    }

    createCorrectFormatOfResult(res: SearchResult[]): ResultStructure[] {
        const convertedResult: ResultStructure[] = [];
        for (const searchResult of res) {
            if (searchResult.resultCode === 1) {
                for (const result of searchResult.res) {
                    convertedResult.push(this.formatResultToObject(result));
                }
            }
        }
        return convertedResult;
    }

    formatResultToObject(result: ResultStructure): ResultStructure {
        return {
            title: result.title,
            price: result.price,
            timePosted: result.timePosted,
            url: result.url,
            tags: result.tags.length > 0 ? result.tags : ["No tags"],
            description: result.description.length > 0 ? result.description : "No description",
            images: result.images || [], // Учитываем наличие images
        };
    }

    async doesRecordExist(telegramId: number, title: string): Promise<boolean> {
        try {
            const record = await FavouriteProduct.findOne({
                where: {
                    telegramId,
                    title,
                },
            });

            return record !== null;
        } catch (error) {
            console.error("Error checking record existence:", error);
            throw new Error("Unable to check record existence.");
        }
    }

    async getFavouriteProducts(telegramId: number): Promise<any[]> {
        try {
            const favouriteProducts = await FavouriteProduct.findAll({
                where: { telegramId },
                attributes: [
                    "title",
                    "price",
                    "currency",
                    "timePosted",
                    "url",
                    "tags",
                    "description"
                ]
            });

            return favouriteProducts.map((product) => ({
                resultCode: 1,
                res: [
                    {
                        title: product.title,
                        price: {
                            amount: product.price,
                            currency: product.currency,
                            count: 1
                        },
                        timePosted: product.timePosted,
                        url: product.url,
                        tags: product.tags ? product.tags.split(", ") : [],
                        description: product.description || "No description available.",
                    },
                ],
            }));
        } catch (error) {
            console.error("Error getting favourite products", error);
            return [];
        }
    }

}
