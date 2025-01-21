import { Module } from '@nestjs/common';
import {DialogService} from "./dialog.service";
import {MenuModule} from "../menu/menu.module";

@Module({
    providers: [DialogService],
    exports: [DialogService],
    imports: [
        MenuModule
    ]
})
export class DialogModule {}