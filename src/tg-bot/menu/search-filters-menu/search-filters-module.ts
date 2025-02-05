import { forwardRef, Module } from '@nestjs/common';
import { CommandModule } from '../../command/command.module';
import { MenuModule } from '../menu.module';
import { ChooseFilterSubCatMenu, SearchFiltersMenu, SubCatMenu } from './searchFiltersMenu';
import {
  GenerateFiltersMenu,
  getCategories,
  OpenCategoryMenu,
  OpenSubCategoryMenu,
  setCategory,
} from './search-filters-menu-handler';
import { SearchPropertiesModule } from '../../../search/search-properties/search-properties.module';
import { MaxPrice, MinPrice } from './price-module/price-handler';
import { MaxPriceDialog, MinPriceDialog } from './price-module/price-dialog';
import { OpenSetFilterStateMenu, SetState } from './state-modlule/state-handlers';
import { ChooseFilterStateMenu } from './state-modlule/state-menu';
import { DialogModule } from '../../dialog/dialog.module';
import { SearchManageModule } from '../../../search/search-manage/search-manage.module';
import { SearchHandler, SearchReadyHandler } from './search-query-module/searchHandler';
import { SearchDialog } from './search-query-module/searchDialog';
import { OpenAiModule } from '../../../open-ai/open-ai.module';

@Module(
  {
    providers: [
      SearchFiltersMenu,
      ChooseFilterStateMenu,
      ChooseFilterSubCatMenu,
      SubCatMenu,
      setCategory,
      getCategories,
      OpenCategoryMenu,
      OpenSubCategoryMenu,
      MinPrice,
      MinPriceDialog,
      MaxPrice,
      MaxPriceDialog,
      GenerateFiltersMenu,
      SetState,
      OpenSetFilterStateMenu,
      SearchHandler,
      SearchReadyHandler,
      SearchDialog
    ],
    imports: [
      CommandModule,
      OpenAiModule,
      forwardRef(()=> DialogModule) ,
      forwardRef( () => MenuModule) ,
      SearchPropertiesModule,
      SearchManageModule
    ],
    exports: [
      SearchFiltersMenu,
      ChooseFilterStateMenu,
      ChooseFilterSubCatMenu
    ],
  }
)
export class FilterMenuModule {}