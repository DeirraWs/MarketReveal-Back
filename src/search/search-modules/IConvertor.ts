import { SearchParams } from '../../tg-bot/tg-bot.service';
import { ResultStructure } from '../types/types';

export abstract class IConvertor {

  abstract ConvertSearchParamsToUrl(searchParams: SearchParams): string;
  abstract ConvertSearchResultsToStandard(results:Object[]):ResultStructure[];

}