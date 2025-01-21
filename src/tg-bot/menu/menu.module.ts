// menu/menu.module.ts
import {Module} from '@nestjs/common';
import {MenuService} from './menu.service';
import {CommandModule} from '../command/command.module';
import {AccountMenu, ChangeLanguageMenu} from './accountMenu';
import {TrackingMenu} from "./trackingMenu";
import { PaginationMenuModule } from './pagination-menu/pagination-menu.module';
import { MainMenuModule } from './main-menu/main-menu-module';
import {ChooseFilterStateMenu, ChooseFilterSubCatMenu, SearchFiltersMenu} from "./searchFiltersMenu";

@Module({
    imports: [
        CommandModule,
        PaginationMenuModule,
        MainMenuModule
    ],
    providers: [
        AccountMenu,
        ChangeLanguageMenu,
        MenuService,
        TrackingMenu,
        SearchFiltersMenu,
        ChooseFilterStateMenu,
        ChooseFilterSubCatMenu
    ],
    exports: [MenuService],
})
export class MenuModule {
}