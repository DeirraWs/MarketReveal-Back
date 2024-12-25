import {Inject, Injectable} from '@nestjs/common';
import { TrackingSession } from './tracking-session';
import {OffersTrackingResultModelService} from "../model/tracking-result.model.service";
import {SearchManageService} from "../../search/search-manage/search-manage.service";
import {RedisCacheService} from "../../redis/redis.service"; // Ваш сервіс бази даних

@Injectable()
export class TrackingManager {
    private sessions: Map<string, TrackingSession> = new Map();

    constructor(
        @Inject() private readonly searchService: SearchManageService,
        @Inject() private readonly databaseService: OffersTrackingResultModelService,
        @Inject() private readonly cacheService: RedisCacheService,
    ) {}

    startTracking(trackID: string, url:string, delay: number): void {
        console.log("Start tracking", url)
        if (this.sessions.has(trackID)) {
            console.log(`Tracking already running for trackID: ${trackID}`);
            return;
        }

        const session = new TrackingSession(trackID, delay, url, this.searchService, this.databaseService, this.cacheService);
        this.sessions.set(trackID, session);

        session.start().catch((error) => {
            console.error(`Failed to start tracking for trackID: ${trackID}`, error);
        });
    }

    stopTracking(trackID: string): void {
        const session = this.sessions.get(trackID);
        if (!session) {
            console.log(`No active tracking session for trackID: ${trackID}`);
            return;
        }

        session.stop().then(r => {});
        this.sessions.delete(trackID);
    }
}
