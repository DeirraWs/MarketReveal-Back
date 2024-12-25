// menu/menu.module.ts
import {Module} from '@nestjs/common';
import {MenuService} from './menu.service';
import {CommandModule} from '../command/command.module';
import MenuPagination from './menuResultShow';
import {MainMenu} from './mainMenu';
import {AccountMenu, ChangeLanguageMenu} from './accountMenu';
import {TrackingMenu} from "./trackingMenu";

@Module({
    imports: [
        CommandModule
    ],
    providers: [
        MainMenu,
        AccountMenu,
        MenuPagination,
        ChangeLanguageMenu,
        MenuService,
        TrackingMenu,
    ],
    exports: [MenuService],
})
export class MenuModule {
}