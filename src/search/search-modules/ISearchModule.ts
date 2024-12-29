import {Product, SearchResult} from "../types/types";
import { SearchParams } from '../../tg-bot/tg-bot.service';
import { ITrack } from './ITrack';
import { ICacheTracking } from './ICache';


export abstract class ISearchModule
{

    abstract _productType: {
        string: Product;
    }

    abstract search(searchParams:SearchParams): Promise<SearchResult>

    abstract canSearch(productType: Product): boolean

    abstract createTrack(searchParam:SearchParams,cache:ICacheTracking): ITrack

}