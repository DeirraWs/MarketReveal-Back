import {forwardRef, Module} from '@nestjs/common';
import {SearchManageService} from './search-manage.service';
import {SearchManageController} from './search-manage.controller';
import {olxSearchModule} from "../search-modules/olx/olxSearchModule";
import {DictionaryModule} from "../dictionary/dictionary.module";
import {SearchHandler, SearchReadyHandler} from "../tg/searchHandler";
import {SearchDialog} from "../tg/searchDialog";
import {CommandModule} from "../../tg-bot/command/command.module";
import {DialogModule} from "../../tg-bot/dialog/dialog.module";
import {MenuModule} from "../../tg-bot/menu/menu.module";
import olxSearchCore from "../search-modules/olx/olxSearchCore";
import MenuPagination from '../../tg-bot/menu/pagination-menu/pagination-menu';
import { CacheSearchModule } from '../cache-search/cache-search.module';
import { RedisModule } from '../../redis/redis.module';
import { OlxConvertor } from '../search-modules/olx/olxConvertor';
import {
    MaxPrice,
    MinPrice,
    SendFiltersMessage,
    State,
    SubCat,
    OpenSetFilterStateMenu,
    OpenSetFilterSubCatMenu
} from "../tg/searchFiltersHandlers";
import {MaxPriceDialog, MinPriceDialog} from "../tg/searchFiltersDialogs";

@Module({
    providers: [
        MenuPagination,
        SearchHandler,
        SearchReadyHandler,
        SearchDialog,
        SearchManageService,
        olxSearchModule,
        olxSearchCore,
        OlxConvertor,
        MinPrice,
        MaxPrice,
        State,
        SubCat,
        SendFiltersMessage,
        OpenSetFilterStateMenu,
        OpenSetFilterSubCatMenu,
        MinPriceDialog,
        MaxPriceDialog
    ],
    controllers: [SearchManageController],
    imports: [
        DictionaryModule,
        forwardRef(() => CommandModule),
        DialogModule,
        MenuModule,
        CacheSearchModule,
        RedisModule
    ],
    exports: [
        MenuPagination,
        SearchManageService
    ]
})
export class SearchManageModule {
}
