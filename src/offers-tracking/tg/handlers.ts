import {CommandService, Handler} from "../../tg-bot/command/command.service";
import {Inject, Injectable} from "@nestjs/common";
import { MyContext, SearchParams } from '../../tg-bot/tg-bot.service';
import {OffersTrackingService} from "../offers-tracking.service";

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
        console.log(searchParams);
        context.session.TrackingMenu.push({
            query:context.session.searchData.searchParams.query,
            uuid: await this.trackingService.startTracking(searchParams),
            resultsCount:0,
        });
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
        context.session.searchData.checkTrackedData = true;
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
