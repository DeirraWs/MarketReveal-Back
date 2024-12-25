import {SearchManageService} from "../../search/search-manage/search-manage.service";
import {OffersTrackingResultModelService} from "../model/tracking-result.model.service";
import {ResultStructure} from "../../search/types/types";
import {RedisCacheService} from "../../redis/redis.service";

class TrackingSearch {

    private cachedUrls: string[] = [];

    constructor(
        private readonly searchManageService: SearchManageService,
        private readonly cacheService: RedisCacheService,
        private readonly url: string,
    ) {
    }

    async search(): Promise<ResultStructure[]> {

        const newLinks = await this.checkByExistsInCacheReturnDont(await this.searchManageService.getListProductUrls(this.url));

        console.log("New links", newLinks);
        this.cachedUrls = [...this.cachedUrls, ...newLinks];

        const res = await this.searchManageService.searchProductByUrls(newLinks);

        let finalResult: ResultStructure[] = []

        for (const searchResult of res) {
            if (searchResult.resultCode === 1) {
                finalResult = [...finalResult, ...searchResult.res]
            }
        }

        await this.addToCacheUrls(newLinks);

        return finalResult;
    }

    async cleanCache(): Promise<void> {
        for (const url of this.cachedUrls) {
            await this.cacheService.delete(url);
        }
    }

    private async addToCacheUrls(urls: string[]): Promise<void> {
        for (const url of urls) {
            console.log(`Adding to cache: url:${url}`);
            await this.cacheService.set(`url:${url}`, url); // Додаємо ключ із префіксом
        }
    }

    private async checkByExistsInCacheReturnDont(urls: string[]): Promise<string[]> {
        const checks = await Promise.all(
            urls.map(async (url) => {
                const exists = await this.cacheService.has(`url:${url}`); // Перевіряємо ключ із префіксом
                console.log(`Checking cache for url:${url}: ${exists}`);
                return { url, exists };
            })
        );

        return checks.filter((check) => !check.exists).map((check) => check.url);
    }




}

export class TrackingSession {
    private intervalId: NodeJS.Timeout | null = null;

    constructor(
        private readonly trackID: string,
        private readonly delay: number,
        private readonly url: string,
        private readonly searchService: SearchManageService,
        private readonly databaseService: OffersTrackingResultModelService,
        private readonly cacheService: RedisCacheService,
        private readonly _trackingSearch = new TrackingSearch(searchService, cacheService, url),
    ) {
    }

    async start(): Promise<void> {
        console.log(`Tracking started for trackID: ${this.trackID}`);
        this.intervalId = setInterval(async () => {
            try {
                console.log("Search do");
                const results = await this._trackingSearch.search()
                if (results.length > 0) {
                    await this.databaseService.addNewResultToTrack(this.trackID, results);
                    console.log(`Results saved for trackID: ${this.trackID}`);
                }
            } catch (error) {
                console.error(`Error during tracking for trackID ${this.trackID}:`, error);
            }
        }, this.delay);
    }

    async stop(): Promise<void> {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            console.log(`Tracking stopped for trackID: ${this.trackID}`);
            this.intervalId = null;
            await this._trackingSearch.cleanCache()
        }
    }
}
