import { ISearchCore } from "../ISearchCore";
import axios from 'axios';
import * as cheerio from "cheerio";
import { Injectable } from "@nestjs/common";

export interface IPrice {
    amount: number;
    currency: string;
    count: number;
}

@Injectable()
export default class olxSearchCore extends ISearchCore {

    private _links: string[] = [];

    async getHtmlPage(url: string): Promise<cheerio.Root> {
        try {
            const response = await axios.get(url);
            return cheerio.load(response.data);
        } catch (e) {
            console.log("Error fetching the URL:", e);
        }
    }

    getAllUrlToDetailedInformationFromPage(page: cheerio.Root) {
        let prevHref = "";

        page('a.css-qo0cxu').each((i: number, element: cheerio.Element) => {
            const href = page(element).attr('href');

            if (href && prevHref !== href) {
                this._links.push("https://www.olx.ua" + href.slice(2, href.length));
                prevHref = href;
            }
        });
    }

    async logAllOfferUrl() {
        console.log("All Offer URLs:");
        this._links.forEach((value) => {
            console.log(value);
        });
    }

    async offerParser() {
        const offers = [];
        for (const urlToOffer of this._links) {
            const htmlPage: cheerio.Root | undefined = await this.getHtmlPage(urlToOffer);
            const offer = this._parseOfferHtmlPage(htmlPage, urlToOffer);
            if (offer) {
                offers.push(offer);
            }
        }
        this._links = []
        return offers;
    }

    private _parseOfferHtmlPage(htmlPage: cheerio.Root | undefined, url: string) {
        if (htmlPage) {
            return {
                url,
                title: this._getTitle(htmlPage),
                price: this._getPrice(htmlPage),
                timePosted: this._getTime(htmlPage),
                tags: this._getOfferTags(htmlPage),
                description: this._getDescription(htmlPage),
                images: this._getImages(htmlPage),
            };
        } else {
            console.log("HTML page not found");
        }
    }

    private _getImages(htmlPage: cheerio.Root): string[] {
        const images: string[] = [];
        htmlPage(".css-1bmvjcs").each((i, e) => {
            const image: string | undefined = htmlPage(e).attr('src');
            if (image) {
                images.push(image);
            }
        });
        return images;
    }

    private _getTime(htmlPage: cheerio.Root) {
        return htmlPage('.css-19yf5ek').text();
    }

    private _getTitle(htmlPage: cheerio.Root) {
        return htmlPage('.css-1kc83jo').text();
    }

    private _getPrice(htmlPage: cheerio.Root): IPrice {
        return this._priceStringToNumber(htmlPage('.css-90xrc0').text());
    }

    private _priceStringToNumber(priceString: string): IPrice {
        const numberList = {
            "0": "0",
            "1": "1",
            "2": "2",
            "3": "3",
            "4": "4",
            "5": "5",
            "6": "6",
            "7": "7",
            "8": "8",
            "9": "9",
            " ": ""
        };

        let outputPrice: IPrice = {
            currency: "",
            amount: 0,
            count: 0
        };

        let tmpString: string = "";
        let i: number = 0;
        for (i; i < priceString.length; i++) {
            if (priceString[i] in numberList) {
                tmpString += numberList[priceString[i]];
            } else {
                let indexStart: number = i;
                for (i; i < priceString.length; i++) {
                    if (priceString[i] === "/") {
                        outputPrice.currency = priceString.substring(indexStart, i);
                        outputPrice.count = parseInt(priceString.substring(i, priceString.length).replace(/\s+/g, '').replace(/[^0-9]/g, ''), 10);
                    }
                }
                if (outputPrice.currency === "")
                    outputPrice.currency = priceString.substring(indexStart, i);
            }
        }

        outputPrice.amount = parseInt(tmpString, 10);
        return outputPrice;
    }

    private _getOfferTags(htmlPage: cheerio.Root): string[] {
        const tags: string[] = [];
        htmlPage('.css-rn93um .css-1r0si1e .css-b5m1rv').each((index: number, element: cheerio.Element) => {
            tags.push(htmlPage(element).text());
        });
        return tags;
    }

    private _getDescription(htmlPage: cheerio.Root) {
        return htmlPage(".css-1o924a9").text();
    }

    async search(urls: [string]): Promise<Object[]> {
        console.log(`url: ${urls[0]}`);
        for (const url of urls) {
            this.getAllUrlToDetailedInformationFromPage(await this.getHtmlPage(url));
        }
        return await this.offerParser();
    }
}