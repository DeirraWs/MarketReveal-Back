import {Inject, Injectable} from '@nestjs/common';
import {ISearchModule} from "../search-modules/ISearchModule";
import {olxSearchModule} from "../search-modules/olx/olxSearchModule";
import {DictionaryService} from "../dictionary/dictionary.service";
import { ResultStructure, SearchResult } from '../types/types';
import { SearchParams } from '../../tg-bot/tg-bot.service';
import { RedisCacheService } from '../../redis/redis.service';
import { ITrack } from '../search-modules/ITrack';
import { ICacheTracking } from '../search-modules/ICache';
import { CacheTrackingService } from '../cache-search/cache-serch.service';

@Injectable()
export class SearchManageService {

    constructor(@Inject() private _dictionaryService: DictionaryService,
                @Inject() private olxSearchModule: olxSearchModule,
                @Inject() private cacheService: RedisCacheService,
    ) {}

    private _searchModules: ISearchModule[] = [
        this.olxSearchModule
    ]

    async searchProduct (name: string): Promise<SearchResult[]> {
        const finalRes:SearchResult[] = []
        for (const searchModule of this._searchModules) {
            const searchResult = await searchModule.search(
              {
                  query:name,
                  params:{},
                  filters:{minPrice:0,maxPrice:Infinity}
              }
            )
            finalRes.push(searchResult)
        }

        return finalRes;
    }

    createTrackingSession(searchParams:SearchParams,trackId:string): Tracks {
        return new Tracks(searchParams,this._searchModules,new CacheTrackingService(this.cacheService,trackId))
    }

}

export class Tracks {

    private _searchModulesTracks: ITrack[] = []


    constructor(
      private readonly _searchParams:SearchParams,
      private readonly _searchModules: ISearchModule[],
      private readonly _cacheService: ICacheTracking,
    ) {
    }


    async start(){
        for (const searchModule of this._searchModules) {
            this._searchModulesTracks.push( searchModule.createTrack(this._searchParams,this._cacheService))
        }
    }

    async getData(): Promise<ResultStructure[]> {
        const results = await Promise.all(
          this._searchModulesTracks.map((track) => track.getData())
        );
        return results.flat();
    }

    async stop(){
        await this._cacheService.clearAllCache()
    }

}