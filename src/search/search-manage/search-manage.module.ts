import {forwardRef, Module} from '@nestjs/common';
import {SearchManageService} from './search-manage.service';
import {SearchManageController} from './search-manage.controller';
import {olxSearchModule} from "../search-modules/olx/olxSearchModule";
import {DictionaryModule} from "../dictionary/dictionary.module";
import olxSearchCore from "../search-modules/olx/olxSearchCore";
import { CacheSearchModule } from '../cache-search/cache-search.module';
import { RedisModule } from '../../redis/redis.module';
import { olxConvertor } from '../search-modules/olx/olx-convertor.service';
import { OpenAiModule } from '../../open-ai/open-ai.module';

@Module({
    providers: [
        SearchManageService,
        olxSearchModule,
        olxSearchCore,
        olxConvertor,
    ],
    controllers: [SearchManageController],
    imports: [
        DictionaryModule,
        CacheSearchModule,
        RedisModule,
        OpenAiModule
    ],
    exports: [
        SearchManageService
    ]
})
export class SearchManageModule {
}
