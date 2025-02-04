import { Injectable } from '@nestjs/common';
import { ResultStructure } from '../../types/types';
import { IConvertor } from '../IConvertor';
import { SearchParams } from '../../../tg-bot/tg-bot.service';


@Injectable()
export class olxConvertor extends IConvertor {

  private _baseUrl: string = 'https://www.olx.ua/api/v1/offers/?';
  private _mapCategoryConvertor: MapCategoryConvertor;

  constructor() {
    super();
    this._mapCategoryConvertor = new MapCategoryConvertor();
  }

  ConvertSearchParamsToUrl(searchParams: SearchParams): string {
    return this._createUrl(searchParams.query, searchParams.filters);
  }

  ConvertSearchResultsToStandard(results: Object[]): ResultStructure[] {
    // @ts-ignore
    return results;
  }

  private _setFilters(filters): string {
    const minPrice = filters['minPrice'];
    const maxPrice = filters['maxPrice'];
    const state = filters['state'];
    const subCategory = filters['subCategory'];

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
      filtersList += `&category_id=${this._mapCategoryConvertor.getSubCategoryValue("mobile-phones-accessories",subCategory)}`;
    }

    return filtersList;
  }

  private _convertFilters(filters){

  }

  private _createUrl(query: string, filters): string {
    return `${this._baseUrl}offset=0&limit=40&query=${this._convertStringToUrlForm(query)}${this._setFilters(filters)}&currency=UAH&filter_refiners=spell_checker&suggest_filters=true`;
  }

  private _convertStringToUrlForm(query: string): string {
    return query.replace(/ /g, '%20');
  }
}

class MapCategoryConvertor {

  private _categoryMap: Map<string, {
    value: number,
    subCategoryId: number,
  }>;

  private _subCategoryIdMap: Map<number, Map<string,number>> = new Map;


  constructor() {
    this._categoryMap = new Map([
      ['mobile-phones-accessories', {
        value: 44,
        subCategoryId: 1,
      }],
    ]);

    this._subCategoryIdMap.set(
       1,
       new Map([
         ["smartphones",85],
         ["parts-for-smartphones",1482],
         ["accessories-for-smartphones",442],
       ])
    )
  }

  public getCategoryValue(categoryId: string): number {
     return this._categoryMap.get(categoryId).value;
  }

  public getSubCategoryValue(rootCategoryId: string,subCategoryId: string): number {
    const subCategoryMap = this._subCategoryIdMap.get(this._categoryMap.get(rootCategoryId).subCategoryId)
    return subCategoryMap.get(subCategoryId);
  }
}