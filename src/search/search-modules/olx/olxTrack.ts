
import olxSearchCore from './olxSearchCore';
import { olxConvertor } from './olx-convertor.service';
import { ITrack } from '../ITrack';
import { ResultStructure } from '../../types/types';
import { SearchParams } from '../../../tg-bot/tg-bot.service';
import { ICacheTracking } from '../ICache';

export class olxTrack extends ITrack {

  private readonly url: string

  constructor(
    private readonly searchCore: olxSearchCore,
    private readonly convertor: olxConvertor,
    private readonly cache: ICacheTracking,
    searchParams: SearchParams,
  ) {
    super();
    this.url = convertor.ConvertSearchParamsToUrl(searchParams)
  }

  async getData(): Promise<ResultStructure[]> {

    const resultOFSearch : ResultStructure[] = this.convertor.ConvertSearchResultsToStandard(await this.searchCore.getDetailInformationByProduct([this.url]));

    const newURL : string[] = await this.cache.getUrlsNotExistedInCache(resultOFSearch.map((value)=>{return value.url}))

    return resultOFSearch.filter((value) => newURL.includes(value.url));
  }

}