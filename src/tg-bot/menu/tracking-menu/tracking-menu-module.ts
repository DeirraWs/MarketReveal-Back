import { forwardRef, Module } from '@nestjs/common';
import { CommandModule } from '../../command/command.module';
import { MenuModule } from '../menu.module';
import { TrackingMenu } from './trackingMenu';
import { StartTrackingMenu } from './tracking-menu-handler';


@Module(
  {
    providers: [
      TrackingMenu,
      StartTrackingMenu
    ],
    imports: [
      CommandModule,
      forwardRef( () => MenuModule) ,
    ],
    exports: [
      TrackingMenu,
    ]
  }
)
export class TrackingMenuModule {}