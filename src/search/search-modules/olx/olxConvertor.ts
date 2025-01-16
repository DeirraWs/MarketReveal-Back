import { Injectable } from '@nestjs/common';
import { ResultStructure } from '../../types/types';
import { IConvertor } from '../IConvertor';
import { SearchParams } from '../../../tg-bot/tg-bot.service';


@Injectable()
export class OlxConvertor extends IConvertor {

  _baseUrl: string = "https://www.olx.ua/api/v1/offers/?";

  ConvertSearchParamsToUrl(searchParams: SearchParams): string {
    if (searchParams.params) {
      return this._setOnlyQuery(searchParams.query)
    }
    else{
      console.log(this._setOnlyQuery(searchParams.query));
      return this._setOnlyQuery(searchParams.query)
    }

  }

  ConvertSearchResultsToStandard(results: Object[]): ResultStructure[] {
    // @ts-ignore
    return results;
  }

  private _setWithParams(params: SearchParams): string {
    return ""
  }

  private _setGroups(){

  }

  private _setFilters(): void {

  }

  private _setOnlyQuery( query: string): string{
    return  `${this._baseUrl}offset=0&limit=40&query=${this._convertStringToUrlForm(query)}&currency=UAH&filter_refiners=spell_checker&suggest_filters=true`
  }

  private _convertStringToUrlForm(query: string): string {
    return query.replace(/ /g, '%20');
  }
}