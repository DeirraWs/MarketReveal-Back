// menu/menu.module.ts
import {Module} from '@nestjs/common';
import {MenuService} from './menu.service';
import {CommandModule} from '../command/command.module';
import {AccountMenu, ChangeLanguageMenu} from './accountMenu';
import {TrackingMenu} from "./tracking-menu/trackingMenu";
import { PaginationMenuModule } from './pagination-menu/pagination-menu.module';
import { MainMenuModule } from './main-menu/main-menu-module';
import {ChooseFilterStateMenu, ChooseFilterSubCatMenu, SearchFiltersMenu} from "./searchFiltersMenu";
import { TrackingMenuModule } from './tracking-menu/tracking-menu-module';

@Module({
    imports: [
        CommandModule,
        PaginationMenuModule,
        MainMenuModule,
        TrackingMenuModule
    ],
    providers: [
        AccountMenu,
        ChangeLanguageMenu,
        MenuService,
        SearchFiltersMenu,
        ChooseFilterStateMenu,
        ChooseFilterSubCatMenu
    ],
    exports: [MenuService],
})
export class MenuModule {
}