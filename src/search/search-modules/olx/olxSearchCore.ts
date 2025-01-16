import { ISearchCore } from "../ISearchCore";
import axios from 'axios';
import { IOfferDetail } from './types/OfferData';
import { Injectable } from "@nestjs/common";


export interface IPrice {
    amount: number;
    currency: string;
    count: number;
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

        return {
            id: data.id,
            title: data.title,
            price: this.parsePrice(data.params[data.params.length - 1]),
            description: data.description,
            images: data.photos.map((photo: any) => photo.link),
            timePosted: data.created_time,
            tags: this._getTags(data),
            url: data.url,
        };
    }

    private _getTags(data: IOfferDetail): string[] {
        const tags: string[] = [];
        for (let i = 0; i < data.params.length - 2; i++) {
            tags.push(`${data.params[i].name}:${data.params[i].value.label}`)
        }
        return tags;
    }

    /**
     * Parses the price object from the API response.
     * @param {any} priceData - API price data.
     * @returns {IPrice} Parsed price object.
     */
    private parsePrice(priceData: any): IPrice {
        return {
            amount: priceData?.value || 0,
            currency: priceData?.currency || "UAH",
            count: priceData?.count || 1,
        };
    }
}
