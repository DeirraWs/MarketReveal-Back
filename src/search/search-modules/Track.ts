import { ITrack } from './ITrack';
import { ResultStructure, SearchResult } from '../types/types';
import { ISearchCore } from './ISearchCore';
import { IConvertor } from './IConvertor';
import { ICacheTracking } from './ICache';
import { SearchParams } from '../../tg-bot/tg-bot.service';

export class Track extends ITrack {

  private readonly url: string

  constructor(
    private readonly searchCore: ISearchCore,
    private readonly convertor: IConvertor,
    private readonly cache: ICacheTracking,
    searchParams: SearchParams,
  ) {
    super();
    this.url = convertor.ConvertSearchParamsToUrl(searchParams)
  }

  async getData(): Promise<ResultStructure[]> {

    const resultOFSearch : ResultStructure[] = await this.searchCore.getDetailInformationByProduct([this.url])

    const newURL : string[] = await this.cache.getUrlsNotExistedInCache(resultOFSearch.map((value)=>{return value.url}))

    return resultOFSearch.filter((value) => newURL.includes(value.url));
  }

}