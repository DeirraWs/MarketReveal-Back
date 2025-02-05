import { forwardRef, Module } from '@nestjs/common';
import { CommandModule } from '../../command/command.module';
import { MenuModule } from '../menu.module';
import { TrackingMenu } from './trackingMenu';
import {
  ClearCheckedDataTracking, getCountOfResults,
  GetTracking,
  StartTracking,
  StartTrackingMenu,
  StopTracking,
} from './tracking-menu-handler';
import { OffersTrackingModule } from '../../../offers-tracking/offers-tracking.module';


@Module(
  {
    providers: [
      TrackingMenu,
      StartTrackingMenu,
      StartTracking,
      StopTracking,
      GetTracking,
      ClearCheckedDataTracking,
      getCountOfResults,
    ],
    imports: [
      CommandModule,
      forwardRef( () => MenuModule),
      OffersTrackingModule,
    ],
    exports: [
      TrackingMenu,
    ]
  }
)
export class TrackingMenuModule {}