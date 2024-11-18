// menu/menu.module.ts
import { Module } from '@nestjs/common';
import { MenuService } from './menu.service';
import { CommandModule } from '../command/command.module';

@Module({
    imports: [
        CommandModule
    ],
    providers: [MenuService],
    exports: [MenuService],
})
export class MenuModule {}