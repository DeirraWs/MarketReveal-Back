import { Injectable } from '@nestjs/common';
import { ResultStructure } from '../../types/types';
import { IConvertor } from '../IConvertor';
import { MyContext, SearchParams } from '../../../tg-bot/tg-bot.service';


@Injectable()
export class OlxConvertor extends IConvertor {

  _baseUrl: string = "https://www.olx.ua/api/v1/offers/?";

  ConvertSearchParamsToUrl(searchParams: SearchParams): string {
    if (searchParams.params) {
      return this._setOnlyQuery(searchParams.query, searchParams.filters);
    }
    else{
      return this._setOnlyQuery(searchParams.query, searchParams.filters)
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

  private _setFilters(filters): string {
    const minPrice = filters["minPrice"];
    const maxPrice = filters["maxPrice"];
    const state = filters["state"];
    const subCategory = filters["subCategory"];

    let filtersList = '';

    if (minPrice) {
      filtersList += `&filter_float_price%3Afrom=${minPrice}`;
    }

    if (maxPrice) {
      filtersList += `&filter_float_price%3Ato=${maxPrice}`;
    }

    if (state && state !== 'all') {
      filtersList += `&filter_enum_state%5B0%5D=${state}`;
    }

    if (subCategory && subCategory !== 'all') {
      filtersList += `&category_id=${subCategory}`;
    }

      return filtersList;
  }

  private _setOnlyQuery( query: string, filters): string{
    return  `${this._baseUrl}offset=0&limit=40&query=${this._convertStringToUrlForm(query)}${this._setFilters(filters)}&currency=UAH&filter_refiners=spell_checker&suggest_filters=true`
  }

  private _convertStringToUrlForm(query: string): string {
    return query.replace(/ /g, '%20');
  }
}