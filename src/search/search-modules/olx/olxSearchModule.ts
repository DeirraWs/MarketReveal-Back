import {ISearchModule} from "../ISearchModule";
import {Product, SearchResult} from "../../types/types";
import {Inject, Injectable} from "@nestjs/common";
import olxSearchCore from "./olxSearchCore";
import { OlxConvertor } from './olxConvertor';
import { SearchParams } from '../../../tg-bot/tg-bot.service';
import {ICacheTracking } from '../ICache';
import { ITrack } from '../ITrack';
import { Track } from '../Track';

@Injectable()
export class olxSearchModule extends ISearchModule {

    _productType: {
        string: Product;
    };

    constructor(
      @Inject() private _searchCore: olxSearchCore,
      //@Inject() private cacheService,
      @Inject() private _convertor: OlxConvertor,
    ) {
        super();
    }

    canSearch(productType: Product): boolean {
        if (this._productType[productType.id]) {
            return true;
        }
    }

    async search(searchParams:SearchParams): Promise<SearchResult> {
        return {
            resultCode: 1,
            res: this._convertor.ConvertSearchResultsToStandard(await this._searchCore.getDetailInformationByProduct([this._convertor.ConvertSearchParamsToUrl(searchParams)]))
        }
    }

    createTrack(searchParam: SearchParams, cache: ICacheTracking): ITrack {
        return new Track(this._searchCore,this._convertor,cache,searchParam);
    }

}