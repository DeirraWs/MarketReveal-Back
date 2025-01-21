import { ISearchCore } from "../ISearchCore";
import axios from 'axios';
import { IOfferDetail, IParam } from './types/OfferData';
import { Injectable } from "@nestjs/common";


export interface IPrice {
    amount: number;
    currency: string;
}

@Injectable()
export default class olxSearchCore extends ISearchCore {

    async getListOfProductsUrls(url:string) : Promise<string[]> {
        const data = await this.getListOfProducts(url)
        return data.map( (offer: IOfferDetail) => {return offer.url} )
    }

    async getDetailInformationByProduct(urls:string[]): Promise<Object[]> {
        try {
            const data = await this.getListOfProducts(urls[0])
            return data.map( (offer: IOfferDetail) => {return this.parseOfferDetails(offer)})
        } catch (e){
            console.log(e);
        }
    }

    async getListOfProducts(url:string): Promise<IOfferDetail[]> {
        try {
            const response = await axios.get(url);
            return response.data?.data || [];
        } catch (error) {
            console.error("Error fetching products list:", error);
            return [];
        }
    }

     /**
     * Parses the API response to extract offer details.
     * @param {any} data - API response for a single offer.
     * @returns {Object} Parsed offer details.
     */
    private parseOfferDetails(data: IOfferDetail): Object {
        if (!data) return null;

        let parsedParams = this._parseParams(data);

        return {
            id: data.id,
            title: data.title,
            price: parsedParams.price,
            description: this._getDescriptionCorrect(data.description),
            images: data.photos.map((photo: any) => photo.link),
            timePosted: data.last_refresh_time,
            tags: parsedParams.tags,
            url: data.url,
        };
    }

    private _parseParams(data: IOfferDetail): {
        tags: string[]
        price:IPrice,
    } {
        let res: {tags: string[],price:IPrice} = {tags:[],price:{amount:0,currency:"UAH"}};

        if (data.params.length === 0) {
            return {
                tags: [],
                price: {amount:0,currency:"UAH"}
            }
        }

        if (data.params[0].key === "price"){
            res.price = this._parsePrice(data.params[0])
            res.tags = this._getTags(data.params,1,data.params.length-1)
        } else {
            res.price = this._parsePrice(data.params[data.params.length - 1])
            res.tags = this._getTags(data.params,0,data.params.length-2)
        }

        return res;
    }

    private _getTags(data: IParam[],startIndex: number, lastIndex: number ): string[] {
        const tags: string[] = [];
        for (let i = startIndex; i < lastIndex; i++) {
            tags.push(`${data[i].name}:${data[i].value.label}`)
        }
        return tags;
    }

    private _getDescriptionCorrect( description: string ): string {
        let cleaned = description.replace(/<[^>]*>/g, '');

        cleaned = cleaned.replace(/\\u[0-9A-Fa-f]{4}/g, '');
        cleaned = cleaned.replace(/\\n/g, '');
        cleaned = cleaned.replace(/-{3,}/g, '');
        cleaned = cleaned.replace(/\s{2,}/g, ' ').trim();

        return cleaned;
    }

    /**
     * Parses the price object from the API response.
     * @param {any} priceData - API price data.
     * @returns {IPrice} Parsed price object.
     */

    private _parsePrice(priceData: any): IPrice {
        return {
            amount: priceData?.value.value || 0,
            currency: priceData?.currency || "UAH",
        };
    }
}
