import {Inject, Injectable} from '@nestjs/common';
import {ISearchModule} from "../search-modules/ISearchModule";
import {olxSearchModule} from "../search-modules/olx/olxSearchModule";
import {DictionaryService} from "../dictionary/dictionary.service";
import { SearchResult } from '../types/types';
import * as url from "node:url";

@Injectable()
export class SearchManageService {

    constructor(@Inject() private _dictionaryService: DictionaryService,
                @Inject() private olxSearchModule: olxSearchModule) {}

    private _searchModules: ISearchModule[] = [
        this.olxSearchModule
    ]

    async searchProduct (name: string): Promise<SearchResult[]> {
        this._searchModules.forEach((searchModule)=>{
            searchModule.setNames(this._dictionaryService.getSynonyms(name))
        })
        const finalRes:SearchResult[] = []
        for (const searchModule of this._searchModules) {
            const searchResult = await searchModule.search()
            finalRes.push(searchResult)
        }
        return finalRes;
    }

    async getListProductUrls(url:string):Promise<string[]> {
        let list:string[] = []

        for (const searchModule of this._searchModules) {
            const result = await searchModule.getListOfUrls(url)
            list = [...list, ...result]
        }

        return list
    }

    async searchProductByUrls(urls:string[]):Promise<SearchResult[]> {
        let res: SearchResult[] = []
        for (const searchModule of this._searchModules) {
            const searchResult = await searchModule.getDetailInformationByProduct(urls)
            res.push(searchResult)
        }
        return res;
    }
}
