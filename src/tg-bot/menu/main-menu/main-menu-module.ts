import { forwardRef, Module } from '@nestjs/common';
import { CommandModule } from '../../command/command.module';
import { MenuModule } from '../menu.module';
import { MainMenu } from './main-menu';
import { StartMainMenu } from './main-menu-handlers';


@Module(
  {
    providers: [
      MainMenu,
      StartMainMenu,
    ],
    imports: [
      CommandModule,
      forwardRef( () => MenuModule) ,
    ],
    exports: [
      MainMenu,
    ]
  }
)
export class MainMenuModule {}