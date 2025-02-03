import { ResultStructure } from '../types/types';

export abstract class ITrack {

   abstract getData(): Promise<ResultStructure[]>;

}