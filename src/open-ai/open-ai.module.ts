import { forwardRef, Module } from '@nestjs/common';
import { OpenAiController } from './open-ai.controller';
import { OpenAIService } from './open-ai.service';

import { DialogModule } from '../tg-bot/dialog/dialog.module';
import { CommandModule } from '../tg-bot/command/command.module';

@Module({
  controllers: [OpenAiController],
  providers: [OpenAIService],
  imports: [

  ],
  exports: [
    OpenAIService,
  ]
})
export class OpenAiModule {}
