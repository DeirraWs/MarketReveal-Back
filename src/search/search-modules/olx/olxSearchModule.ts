import {ISearchModule} from "../ISearchModule";
import {Product, SearchResult} from "../../types/types";
import {ISearchCore} from "../ISearchCore";
import {Inject, Injectable} from "@nestjs/common";
import olxSearchCore from "./olxSearchCore";

@Injectable()
export class olxSearchModule extends ISearchModule {
    _baseUrl: string = "https://www.olx.ua/uk/list";

    _productType: {
        string: Product;
    };

    _searchUrls: string[];

    _searchCore: ISearchCore;

    constructor(@Inject() olxSearchCore: olxSearchCore) {
        super();
        this._searchCore = olxSearchCore;
    }

    canSearch(productType: Product): boolean {
        if (this._productType[productType.id]) {
            return true;
        }
    }

    async search(): Promise<SearchResult> {
        const res = await this._searchCore.search(this._searchUrls);
        this._searchUrls = [];
        return this._transformResultToStandardType(res);
    }

    setFilter(Filter: Object): void {
        return;
    }

    setNames(names: string[]): void {
        const correctNames = this.transformNames(names)
        this._searchUrls = correctNames.map((value)=>{
            return this._baseUrl+ `/q-${value}/`
        })
    }

    private transformNames(names:string[]):string[] {
        return names.map((str) => str.replace(/ /g, '-'));
    }

    private _transformResultToStandardType(result: any): SearchResult {
        return {
            resultCode:1,
            res: result,
        };
    }
}