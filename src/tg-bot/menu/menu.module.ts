// menu/menu.module.ts
import {Module} from '@nestjs/common';
import {MenuService} from './menu.service';
import {CommandModule} from '../command/command.module';
import {MainMenu} from './mainMenu';
import {AccountMenu, ChangeLanguageMenu} from './accountMenu';
import {TrackingMenu} from "./trackingMenu";
import { PaginationMenuModule } from './pagination-menu/pagination-menu.module';

@Module({
    imports: [
        CommandModule,
        PaginationMenuModule,
    ],
    providers: [
        MainMenu,
        AccountMenu,
        ChangeLanguageMenu,
        MenuService,
        TrackingMenu,
    ],
    exports: [MenuService],
})
export class MenuModule {
}