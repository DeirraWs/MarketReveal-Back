import { ITrack } from './ITrack';
import { ResultStructure } from '../types/types';
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
    return this.convertor.ConvertSearchResultsToStandard(
      await this.searchCore.getDetailInformationByProduct(
        await this.cache.getUrlsNotExistedInCache(
          await this.searchCore.getListOfProductsUrls(this.url)
        )
      )
    )
  }

}