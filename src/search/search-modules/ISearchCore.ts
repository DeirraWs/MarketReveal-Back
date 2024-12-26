

export abstract class ISearchCore{

    abstract search(urls: string[]): Promise<Object[]>

    abstract getListOfUrls(url: string): Promise<string[]>

    abstract getDetailInformationByProduct(urls: string[]): Promise<Object[]>
}