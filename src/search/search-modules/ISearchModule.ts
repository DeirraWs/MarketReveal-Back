import {Product, SearchResult} from "../types/types";


export abstract class ISearchModule
{

    abstract _baseUrl: string;

    abstract _searchUrls: string[];

    abstract _productType: {
        string: Product;
    }

    abstract search(): Promise<SearchResult>

    abstract setFilter(Filter: Object): void

    abstract setNames(names: string[]): void

    abstract canSearch(productType: Product): boolean

    abstract getListOfUrls(url:string):Promise<string[]>

    abstract getDetailInformationByProduct(urls: string[]): Promise<SearchResult>
}