import {CommandService, Handler} from "../../tg-bot/command/command.service";
import {Inject, Injectable} from "@nestjs/common";
import { MyContext, SearchParams } from '../../tg-bot/tg-bot.service';
import {OffersTrackingService} from "../offers-tracking.service";
import { Track } from '../../search/search-modules/Track';

@Injectable()
export class StartTracking extends Handler {

    constructor(
        private readonly command: CommandService,
        @Inject() private readonly trackingService: OffersTrackingService
    ) {
        super();
        command.addHandler("start-t",this)
    }

    async handlerLogic(context: MyContext,searchParams:SearchParams): Promise<any> {
        const newTrackUUID = await this.trackingService.startTracking(searchParams)
        context.session.TrackingMenu.push({
            query:context.session.searchData.searchParams.query,
            uuid: newTrackUUID,
            resultsCount:0,
        });
        return newTrackUUID;
    }

}

@Injectable()
export class StopTracking extends Handler {

    constructor(
        private readonly command: CommandService,
        @Inject() private readonly trackingService: OffersTrackingService
    ) {
        super();
        command.addHandler("stop-t",this)
    }

    async handlerLogic(context: MyContext,uuid:string): Promise<any> {
        context.session.TrackingMenu = context.session.TrackingMenu.filter((data)=> data.uuid !== uuid)
        await this.trackingService.stopTracking(uuid)
    }
}

@Injectable()
export class GetTracking extends Handler {

    constructor(
        @Inject() private readonly command: CommandService,
        @Inject() private readonly trackingService: OffersTrackingService
    ) {
        super();
        command.addHandler("get-t",this)
    }

    async handlerLogic(context: MyContext,uuid:string): Promise<any> {
        const res = await this.trackingService.getTrackingResult(uuid)
        context.session.searchData.data = [{
            resultCode:1,
            res:res,
        }]
        context.session.searchData.paginationMenu.currentTrackedUUID = uuid;
        await this.command.handle('clear-checked-data-t',context,uuid,res.length);
        await this.command.handle("start-pagination-menu",context)
    }
}

@Injectable()
export class ClearCheckedDataTracking extends Handler {

    constructor(
        private readonly command: CommandService,
        @Inject() private readonly trackingService: OffersTrackingService
    ) {
        super();
        command.addHandler("clear-checked-data-t",this)
    }

    async handlerLogic(context: MyContext,uuid:string,count:number): Promise<any> {
       await this.trackingService.setOffersToChecked(uuid,[],-count)
    }
}

@Injectable()
export class getCountOfResults extends Handler {

    constructor(
        private readonly command: CommandService,
        @Inject() private readonly trackingService: OffersTrackingService
    ) {
        super();
        command.addHandler("get-count-of-results-t",this)
    }

    async handlerLogic(context: MyContext,uuid:string): Promise<number> {
        return await this.trackingService.getCountOfResultInTrack(uuid);
    }
}
