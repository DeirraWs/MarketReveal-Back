import { Module } from '@nestjs/common';
import { CommandService } from './command.service';
import {MenuModule} from "../menu/menu.module";


@Module({
    providers: [CommandService],
    exports: [CommandService],
    imports: [
    ]
})
export class CommandModule {}