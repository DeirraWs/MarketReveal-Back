import { Injectable } from '@nestjs/common';

@Injectable()
export class DictionaryService {

    getSynonyms(name: string): string[] {
        return [name]
    }

}
