import { Inject, Injectable } from '@nestjs/common';
import { CommandService, Handler } from '../../../command/command.service';
import { DialogService } from '../../../dialog/dialog.service';
import { MyContext } from '../../../tg-bot.service';

@Injectable()
export class MinPrice extends Handler {

  constructor(@Inject() commandService: CommandService,
              @Inject() private dialogService: DialogService,
  ) {
    super();
    commandService.addHandler('set-filter-min-price', this);
  }

  async handlerLogic(context: MyContext): Promise<any> {
    await context.reply(context.t('minPrice.inputDesc'));
    await this.dialogService.startDialog(context, 'get-filter-min-price');
  }

}

@Injectable()
export class MaxPrice extends Handler {

  constructor(@Inject() commandService: CommandService,
              @Inject() private dialogService: DialogService) {

    super();
    commandService.addHandler('set-filter-max-price', this);
  }

  async handlerLogic(context: MyContext): Promise<any> {
    await context.reply(context.t('maxPrice.inputDesc'));
    await this.dialogService.startDialog(context, 'get-filter-max-price');
  }
}