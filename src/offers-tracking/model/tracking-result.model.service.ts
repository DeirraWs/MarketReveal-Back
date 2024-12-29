import {Injectable} from "@nestjs/common";
import {IResult, TrackingResult} from "./tracking-result.model";
import {InjectModel} from "@nestjs/sequelize";
import {ResultStructure} from "../../search/types/types";
import {v4 as uuidv4} from 'uuid';
import { SearchParams } from '../../tg-bot/tg-bot.service';

@Injectable()
export class OffersTrackingResultModelService {

    constructor(
        @InjectModel(TrackingResult) private TrackingResultModel: typeof TrackingResult
    ) {
    }

    async getTrackById(trackID: string): Promise<TrackingResult> {
        return await this.TrackingResultModel.findOne({
            where: {
                id: trackID
            }
        })
    }

    async getAllResultByID(trackID: string): Promise<IResult[]> {
        try {
            const track = await this.getTrackById(trackID);
            return track.res
        } catch (e) {
            console.log(e)
        }
    }

    async createTrack(uuid: string, searchParameters: SearchParams): Promise<void> {
        try {
            await this.TrackingResultModel.create({
                id: uuid,
                searchQuery: searchParameters.query,
                searchParameters: searchParameters.params,
            })
        } catch (e) {
            console.log(e)
        }
    }

    async addNewResultToTrack(trackID: string, searchData: ResultStructure[]): Promise<void> {
        try {
            const track = await this.getTrackById(trackID)

            const newResults: IResult[] = searchData.map((data) => {
                return {
                    id: uuidv4(),
                    data: data,
                }
            })

            await this.changeCountOfResultsInTrack(newResults.length, track.id);
            track.res = [...track.res, ...newResults]
            await track.save()

        } catch (e) {
            console.log(e)
        }
    }

    async deleteTrack(trackID: string): Promise<void> {
        try {
            const track = await this.getTrackById(trackID)
            await track.destroy()
        } catch (e) {
            console.log(e)
        }
    }

    async deleteAllResultsByTrackId(trackID: string): Promise<void> {
        try {
            const track = await this.getTrackById(trackID)
            track.res = [];
            await track.save();
        } catch (e) {
            console.log(e)
        }
    }

    async getCountOfResultByTrackID(trackID: string): Promise<number> {
        try {
            console.log("FROM SERVISE MODEL RESULT TRACK ", trackID)
            const track = await this.getTrackById(trackID);
            return track.count
        } catch (e) {
            console.log(e)
        }
    }

    async changeCountOfResultsInTrack(count: number, track: TrackingResult): Promise<void>;
    async changeCountOfResultsInTrack(count: number, trackID: string): Promise<void>;
    async changeCountOfResultsInTrack(count: number, trackOrID: TrackingResult | string): Promise<void> {
        try {
            let _track: TrackingResult;

            if (typeof trackOrID === "string") {
                // Якщо передано trackID, завантажуємо трек за ID
                _track = await this.getTrackById(trackOrID);
            } else {
                // Якщо передано track, використовуємо його
                _track = trackOrID;
            }

            _track.count = _track.count + count;
            await _track.save();
        } catch (e) {
            console.log(e);
        }
    }
}