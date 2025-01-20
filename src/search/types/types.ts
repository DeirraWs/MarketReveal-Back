import { IPrice } from '../search-modules/olx/olxSearchCore';


export interface SearchResult {
    resultCode: number;
    res: ResultStructure[]
}

export interface ResultStructure {
    url: string;
    title: string;
    price: IPrice;
    timePosted: string;
    tags: string[];
    description: string;
    images: string[];
}

export interface Product {
    id: number;
    name: string;
}