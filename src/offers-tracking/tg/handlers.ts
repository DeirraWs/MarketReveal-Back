import {CommandService, Handler} from "../../tg-bot/command/command.service";
import {Inject, Injectable} from "@nestjs/common";
import {MyContext} from "../../tg-bot/tg-bot.service";
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

    async handlerLogic(context: MyContext): Promise<any> {
        context.session.TrackingMenu.push({
            query:context.session.searchData.searchParams.query,
            uuid: await this.trackingService.startTracking(`https://www.olx.ua/uk/elektronika/telefony-i-aksesuary/mobilnye-telefony-smartfony/${this.TMPtransformString(context.session.searchData.searchParams.query)}/?currency=UAH`),
            resultsCount:0,
        });
    }

    private TMPtransformString(input: string): string {
        return `q-${input.trim().replace(/\s+/g, '-')}`;
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
        await this.command.handle("start-result-search",context)
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
