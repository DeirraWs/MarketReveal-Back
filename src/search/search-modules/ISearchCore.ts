

export abstract class ISearchCore{

    abstract search(urls: string[]): Promise<Object[]>

}