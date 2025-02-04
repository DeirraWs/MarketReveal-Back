

export abstract class ISearchCore{

    abstract getListOfProductsUrls(url: string): Promise<string[]>
    abstract getDetailInformationByProduct(urls: string[]): Promise<Object[]>

}