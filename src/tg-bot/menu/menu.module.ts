// menu/menu.module.ts
import { forwardRef, Module } from '@nestjs/common';
import { MenuService } from './menu.service';
import { CommandModule } from '../command/command.module';
import { AccountMenu, ChangeLanguageMenu } from './accountMenu';
import { PaginationMenuModule } from './pagination-menu/pagination-menu.module';
import { MainMenuModule } from './main-menu/main-menu-module';
import { TrackingMenuModule } from './tracking-menu/tracking-menu-module';
import { FilterMenuModule } from './search-filters-menu/search-filters-module';

@Module({
  imports: [
    CommandModule,
    forwardRef(()=> PaginationMenuModule) ,
    forwardRef(()=>FilterMenuModule) ,
    forwardRef(()=>MainMenuModule) ,
    forwardRef(()=>TrackingMenuModule) ,
  ],
  providers: [
    AccountMenu,
    ChangeLanguageMenu,
    MenuService,
  ],
  exports: [MenuService],
})
export class MenuModule {
}