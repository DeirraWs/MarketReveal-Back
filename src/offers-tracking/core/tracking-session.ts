import { SearchManageService, Tracks } from '../../search/search-manage/search-manage.service';
import {OffersTrackingResultModelService} from "../model/tracking-result.model.service";
import { SearchParams } from '../../tg-bot/tg-bot.service';

export class TrackingSession {
    private intervalId: NodeJS.Timeout | null = null;
    private _track: Tracks;

    constructor(
        private readonly trackID: string,
        private readonly delay: number,
        private readonly databaseService: OffersTrackingResultModelService,
        private readonly searchManageService: SearchManageService,
        private readonly searchParams: SearchParams
    ) {
        this._track =  searchManageService.createTrackingSession(searchParams,trackID)
    }

    async start(): Promise<void> {
        await this._track.start()
        this.intervalId = setInterval(async () => {
            try {
                const results = await this._track.getData()
                if (results.length > 0) {
                    await this.databaseService.addNewResultToTrack(this.trackID, results);
                }
            } catch (error) {
                console.error(`Error during tracking for trackID ${this.trackID}:`, error);
            }
        }, this.delay);
    }

    async stop(): Promise<void> {
            clearInterval(this.intervalId);
            await this._track.stop()
    }
}
