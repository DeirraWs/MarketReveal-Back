
export abstract class ICache {

  abstract getNewUrls(urls: string[]): Promise<string[]>
  abstract getDataFromCache(urls: string[]): Promise<[]>

}

export abstract class ICacheTracking {

  abstract getUrlsNotExistedInCache(urls: string[]): Promise<string[]>
  abstract clearAllCache(): Promise<void>

}
