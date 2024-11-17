import { Module } from '@nestjs/common';
import { CommandService } from './command.service';


@Module({
    providers: [CommandService],
    exports: [CommandService], // Робимо CommandManagerService доступним для інших модулів
})
export class CommandModule {}