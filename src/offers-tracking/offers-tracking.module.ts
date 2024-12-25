import {Module} from '@nestjs/common';
import {OffersTrackingService} from './offers-tracking.service';
import {OffersTrackingController} from './offers-tracking.controller';
import {SequelizeModule} from "@nestjs/sequelize";
import {TrackingResult} from "./model/tracking-result.model";
import {OffersTrackingResultModelService} from "./model/tracking-result.model.service";
import {TrackingManager} from "./core/offers-tracking-manager";
import {SearchManageModule} from "../search/search-manage/search-manage.module";
import {RedisModule} from "../redis/redis.module";
import {
    ClearCheckedDataTracking, getCountOfResults,
    GetTracking,
    StartTracking,
    StopTracking
} from "./tg/handlers";
import {CommandService} from "../tg-bot/command/command.service";
import {CommandModule} from "../tg-bot/command/command.module";

@Module({
    providers: [
        TrackingManager,
        OffersTrackingService,
        OffersTrackingResultModelService,
        StartTracking,
        StopTracking,
        GetTracking,
        getCountOfResults,
        ClearCheckedDataTracking,
    ],
    controllers: [OffersTrackingController],
    imports: [
        SequelizeModule.forFeature([TrackingResult]),
        SearchManageModule,
        RedisModule,
        CommandModule,
    ],
    exports: [OffersTrackingService, OffersTrackingResultModelService],
})
export class OffersTrackingModule {
}
