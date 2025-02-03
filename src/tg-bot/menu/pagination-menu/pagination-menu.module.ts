import { forwardRef, Module } from '@nestjs/common';
import MenuPagination from './pagination-menu';
import { CommandModule } from '../../command/command.module';
import { MenuModule } from '../menu.module';
import { StartPaginationMenu, StopPaginationMenu } from './pagination-menu-handlers';


@Module(
  {
    providers: [
      MenuPagination,
      StartPaginationMenu,
      StopPaginationMenu,
    ],
    imports: [
      CommandModule,
      forwardRef( () => MenuModule) ,
    ],
    exports: [
      MenuPagination,

    ]
  }
)
export class PaginationMenuModule {}