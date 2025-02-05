import {Module} from '@nestjs/common';
import {OffersTrackingService} from './offers-tracking.service';
import {OffersTrackingController} from './offers-tracking.controller';
import {SequelizeModule} from "@nestjs/sequelize";
import {TrackingResult} from "./model/tracking-result.model";
import {OffersTrackingResultModelService} from "./model/tracking-result.model.service";
import {TrackingManager} from "./core/offers-tracking-manager";
import {SearchManageModule} from "../search/search-manage/search-manage.module";
import {RedisModule} from "../redis/redis.module";

@Module({
    providers: [
        TrackingManager,
        OffersTrackingService,
        OffersTrackingResultModelService,
    ],
    controllers: [OffersTrackingController],
    imports: [
        SequelizeModule.forFeature([TrackingResult]),
        SearchManageModule,
        RedisModule,
    ],
    exports: [OffersTrackingService, OffersTrackingResultModelService],
})
export class OffersTrackingModule {
}
