// menu/menu.module.ts
import { Module } from '@nestjs/common';
import { MenuService } from './menu.service';
import { CommandModule } from '../command/command.module';
import MenuPagination from './menuResultShow';

@Module({
    imports: [
        CommandModule
    ],
    providers: [
      MenuService,
      MenuPagination
    ],
    exports: [MenuService],
})
export class MenuModule {}