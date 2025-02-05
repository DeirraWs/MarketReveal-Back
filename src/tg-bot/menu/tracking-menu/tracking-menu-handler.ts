import { Inject, Injectable } from '@nestjs/common';
import { CommandService, Handler } from '../../command/command.service';
import { MenuService } from '../menu.service';
import { MyContext, SearchParams } from '../../tg-bot.service';
import { TrackingMenu } from './trackingMenu';
import { OffersTrackingService } from '../../../offers-tracking/offers-tracking.service';

@Injectable()
export class StartTrackingMenu extends Handler {

  constructor(
    @Inject() private commandService: CommandService,
    @Inject() private trackingMenu: TrackingMenu,
    @Inject() private menuService: MenuService,
  ) {
    super();
    commandService.addHandler('start-tracking-menu', this);
  }

  async handlerLogic(context: MyContext): Promise<any> {

    await context.reply(context.t('tracking-menu-text'), {
      reply_markup: this.trackingMenu.getMenu()
    })

  }
}




@Injectable()
export class StartTracking extends Handler {

  constructor(
    private readonly command: CommandService,
    @Inject() private readonly trackingService: OffersTrackingService
  ) {
    super();
    command.addHandler("start-t",this)
  }

  async handlerLogic(context: MyContext,searchParams:SearchParams): Promise<any> {
    const newTrackUUID = await this.trackingService.startTracking(searchParams)
    context.session.TrackingMenu.push({
      query:context.session.searchData.searchParams.query,
      uuid: newTrackUUID,
      resultsCount:0,
    });
    return newTrackUUID;
  }

}

@Injectable()
export class StopTracking extends Handler {

  constructor(
    private readonly command: CommandService,
    @Inject() private readonly trackingService: OffersTrackingService
  ) {
    super();
    command.addHandler("stop-t",this)
  }

  async handlerLogic(context: MyContext,uuid:string): Promise<any> {
    context.session.TrackingMenu = context.session.TrackingMenu.filter((data)=> data.uuid !== uuid)
    await this.trackingService.stopTracking(uuid)
  }
}

@Injectable()
export class GetTracking extends Handler {

  constructor(
    @Inject() private readonly command: CommandService,
    @Inject() private readonly trackingService: OffersTrackingService
  ) {
    super();
    command.addHandler("get-t",this)
  }

  async handlerLogic(context: MyContext,uuid:string): Promise<any> {
    const res = await this.trackingService.getTrackingResult(uuid)
    context.session.searchData.data = [{
      resultCode:1,
      res:res,
    }]
    context.session.searchData.paginationMenu.currentTrackedUUID = uuid;
    await this.command.handle('clear-checked-data-t',context,uuid,res.length);
    await this.command.handle("start-pagination-menu",context)
  }
}

@Injectable()
export class ClearCheckedDataTracking extends Handler {

  constructor(
    private readonly command: CommandService,
    @Inject() private readonly trackingService: OffersTrackingService
  ) {
    super();
    command.addHandler("clear-checked-data-t",this)
  }

  async handlerLogic(context: MyContext,uuid:string,count:number): Promise<any> {
    await this.trackingService.setOffersToChecked(uuid,[],-count)
  }
}

@Injectable()
export class getCountOfResults extends Handler {

  constructor(
    private readonly command: CommandService,
    @Inject() private readonly trackingService: OffersTrackingService
  ) {
    super();
    command.addHandler("get-count-of-results-t",this)
  }

  async handlerLogic(context: MyContext,uuid:string): Promise<number> {
    return await this.trackingService.getCountOfResultInTrack(uuid);
  }
}
