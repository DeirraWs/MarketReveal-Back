// menu/menu.module.ts
import { Module } from '@nestjs/common';
import {MenuService } from './menu.service';
import { CommandModule } from '../command/command.module';
import MenuPagination from './menuResultShow';
import { MainMenu } from './mainMenu';

@Module({
    imports: [
        CommandModule
    ],
    providers: [
      MainMenu,
      MenuPagination,
      MenuService,
    ], // Порядок важливий якщо у вас в якомусь меню викликається інше то в якому викликається має бути нижче в списку
       // ( Наприклад в мене в Меню-пагінації є кнопка яка має вернути головне меню тому меню пагінації знаходиться нижче за головне меню  )
    exports: [MenuService],
})
export class MenuModule {}