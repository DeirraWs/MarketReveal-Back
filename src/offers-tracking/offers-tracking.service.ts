import {Inject, Injectable} from '@nestjs/common';
import {ResultStructure} from "../search/types/types";
import {IResult} from "./model/tracking-result.model";
import {TrackingManager} from "./core/offers-tracking-manager";
import { v4 as uuidv4 } from 'uuid';
import {OffersTrackingResultModelService} from "./model/tracking-result.model.service";
import { SearchParams } from '../tg-bot/tg-bot.service';


@Injectable()
export class OffersTrackingService {

    constructor(
        @Inject() private readonly trackingManager: TrackingManager,
        @Inject() private readonly trackingModel: OffersTrackingResultModelService,
    ) {
    }

    async startTracking(searchParams:SearchParams): Promise<string> {
        const uuid = uuidv4()
        this.trackingManager.startTracking(uuid,searchParams,60000)
        await this.trackingModel.createTrack(uuid,searchParams)
        return uuid;
    }

    async stopTracking(uuid: string): Promise<void> {
        this.trackingManager.stopTracking(uuid)
        await this.trackingModel.deleteTrack(uuid)
    }

    async getTrackingResult(trackID: string):Promise<ResultStructure[]> {
        const results: IResult[] = await this.trackingModel.getAllResultByID(trackID)
        return results.map((value)=>{
            return value.data
        })
    }

    async setOffersToChecked(trackID: string, offersID: string[], count:number): Promise<void> {
        await this.trackingModel.deleteAllResultsByTrackId(trackID);
        console.log("setOffersTOChecked",count)
        await this.trackingModel.changeCountOfResultsInTrack(count,trackID)
    }

    async getCountOfResultInTrack(trackID: string): Promise<number> {
        return await this.trackingModel.getCountOfResultByTrackID(trackID);
    }
}
