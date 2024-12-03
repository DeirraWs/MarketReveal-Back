import {forwardRef, Module} from '@nestjs/common';
import {SearchManageService} from './search-manage.service';
import {SearchManageController} from './search-manage.controller';
import {olxSearchModule} from "../search-modules/olx/olxSearchModule";
import {DictionaryModule} from "../dictionary/dictionary.module";
import {SearchHandler} from "../tg/searchHandler";
import {SearchDialog} from "../tg/searchDialog";
import {CommandModule} from "../../tg-bot/command/command.module";
import {DialogModule} from "../../tg-bot/dialog/dialog.module";
import {MenuModule} from "../../tg-bot/menu/menu.module";
import olxSearchCore from "../search-modules/olx/olxSearchCore";
import { SearchResultShowHandler } from './tg/searchResultShowHandler';
import MenuPagination from './tg/menuResultShow';

@Module({
    providers: [
        MenuPagination,
        SearchResultShowHandler,
        SearchHandler,
        SearchDialog,
        SearchManageService,
        olxSearchModule,
        olxSearchCore,

    ],
    controllers: [SearchManageController],
    imports: [
        DictionaryModule,
        forwardRef(()=> CommandModule) ,
        DialogModule,
        MenuModule
    ],
    exports: [
      MenuPagination
    ]
})
export class SearchManageModule {
}
