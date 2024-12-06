import { Dialog, DialogService } from '../../tg-bot/dialog/dialog.service';
import { MyContext } from '../../tg-bot/tg-bot.service';
import { undefined } from 'zod';
import { Inject, Injectable } from '@nestjs/common';
import { OpenAIService } from '../open-ai.service';

@Injectable()
export class dictionaryDialog extends Dialog{
    name:string = "dictionary"

  constructor(@Inject() public dialogService: DialogService,
              @Inject() private openAiService: OpenAIService,) {
    super();
    dialogService.registerDialog(this);
  }

  async start(ctx: MyContext): Promise<void> {
    ctx.session.activeDialog = this.name;
    ctx.session.dialogData = {};
  }

  async processMessage(ctx: MyContext): Promise<void> {
    const dialogData = ctx.session.dialogData;
    if (!dialogData.searchName) {
      dialogData.searchName = ctx.message?.text;
      try {
        const synonyms = await this.openAiService.getSimilarWords(dialogData.searchName)
        await ctx.reply(`${synonyms.join(', ')}`);
        await this.end(ctx)
      } catch (e){
        await ctx.reply("Процес закінчений з помилкою")
        await this.end(ctx)
      }
    }
  }
}