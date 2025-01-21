import { Module } from '@nestjs/common';
import { OpenAiController } from './open-ai.controller';
import { OpenAIService } from './open-ai.service';
import { dictionaryHandler } from './tg/dictionaryHandler';
import { dictionaryDialog } from './tg/dictionaryDialog';
import { DialogModule } from '../tg-bot/dialog/dialog.module';
import { CommandModule } from '../tg-bot/command/command.module';

@Module({
  controllers: [OpenAiController],
  providers: [OpenAIService,
    dictionaryHandler,
    dictionaryDialog],
  imports: [
    DialogModule,
    CommandModule,
  ],
  exports: [
    OpenAIService,
  ]
})
export class OpenAiModule {}
