import {Inject, Injectable} from '@nestjs/common';
import { TrackingSession } from './tracking-session';
import {OffersTrackingResultModelService} from "../model/tracking-result.model.service";
import {SearchManageService} from "../../search/search-manage/search-manage.service";
import {RedisCacheService} from "../../redis/redis.service";
import { SearchParams } from '../../tg-bot/tg-bot.service'; // Ваш сервіс бази даних

@Injectable()
export class TrackingManager {
    private sessions: Map<string, TrackingSession> = new Map();

    constructor(
        @Inject() private readonly searchService: SearchManageService,
        @Inject() private readonly databaseService: OffersTrackingResultModelService,
        @Inject() private readonly cacheService: RedisCacheService,
    ) {}

    startTracking(trackID: string, searchParams: SearchParams, delay: number): void {
        if (this.sessions.has(trackID)) {
            console.log(`Tracking already running for trackID: ${trackID}`);
            return;
        }

        const session = new TrackingSession(trackID, delay,  this.databaseService, this.searchService, searchParams);
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

        session.stop().then();
        this.sessions.delete(trackID);
    }
}
