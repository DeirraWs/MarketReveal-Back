import { Inject, Injectable } from '@nestjs/common';
import { CommandService, Handler } from '../../command/command.service';
import { MenuService } from '../menu.service';
import { MyContext } from '../../tg-bot.service';
import {
  SearchPropertiesCategoryService
} from '../../../search/search-properties/search-properties-category/search-properties-category.service';
import { Category } from '../../../search/search-properties/model/category.model';
import { DialogService } from '../../dialog/dialog.service';


@Injectable()
export class setCategory extends Handler {

  constructor(@Inject() private _commandService: CommandService,
              @Inject() private _searchPropertiesCategoryService: SearchPropertiesCategoryService
  ) {
    super();
    this._commandService.addHandler('set-category', this);
  }

  async handlerLogic(context: MyContext, category: Category): Promise<any> {
    try {
      if (category) {
        context.session.searchData.searchParams.filters['Category'] = category.value;
        await this.setSubCategory(context, category.id)
      }
      await this._commandService.handle('generate-search-properties-message', context);
    } catch (e) {
      console.log(e);
    }
  }

  async setSubCategory(context: MyContext,parentId: string) {
    console.log(parentId);
    context.session.searchData.searchParamsMenuState.subCategory = await this._searchPropertiesCategoryService.getSubCategoriesByParentCategory(parentId)
  }
}

@Injectable()
export class getCategories extends Handler{
  constructor(@Inject() commandService: CommandService,
              @Inject() private _searchPropertiesCategoryService: SearchPropertiesCategoryService
  ) {
    super();
    commandService.addHandler('get-categories', this);
  }

  async handlerLogic(context: MyContext): Promise<any> {
    try {
      context.session.searchData.searchParamsMenuState.category = await this._searchPropertiesCategoryService.getAllCategories();
    } catch (e) {
      console.log(e);
    }
  }
}

@Injectable()
export class OpenCategoryMenu extends Handler {

  constructor(@Inject() commandService: CommandService,
              private readonly menuService: MenuService,
  ) {
    super();
    commandService.addHandler('category-menu-open', this);
  }

  async handlerLogic(context: MyContext): Promise<any> {
    await context.reply(context.t('Category.inputDesc'), {
      reply_markup: this.menuService.getMenuClass('category-menu').getMenu(),
    });
  }
}

@Injectable()
export class OpenSubCategoryMenu extends Handler {

  constructor(@Inject() commandService: CommandService,
              private readonly menuService: MenuService,
  ) {
    super();
    commandService.addHandler('sub-category-menu-open', this);
  }

  async handlerLogic(context: MyContext): Promise<any> {
    await context.reply(context.t('SubCategory.inputDesc'), {
      reply_markup: this.menuService.getMenuClass('sub-category-menu').getMenu(),
    });
  }
}


@Injectable()
export class GenerateFiltersMenu extends Handler {

  constructor(@Inject() commandService: CommandService,
              private readonly menuService: MenuService,
  ) {
    super();
    commandService.addHandler('generate-search-properties-message', this);
  }

  private generateMessage(context: MyContext): string {
    try {
      const filters = context.session.searchData.searchParams.filters || {};
      if (typeof filters !== 'object' || Array.isArray(filters)) {
        console.error('Filters should be an object');
        return context.t('search-process-finish-not-success');
      }

      let message = `${context.t('search-filters-message-header')}:\n`;
      const sortedFilters = Object.keys(filters).sort();
      for (const filter of sortedFilters) {
        message += `${context.t(String(filter))}: ${context.t(`${filter}.values`, { value: String(filters[filter]) })}\n`;
      }

      return message;
    } catch (error) {
      console.error('Error generating message:', error);
      return context.t('search-process-finish-not-success');
    }
  }

  async handlerLogic(context: MyContext): Promise<any> {
    await context.reply(`${this.generateMessage(context)}`, {
      reply_markup: this.menuService.getMenuClass('search-search-properties-menu').getMenu(),
    });
  }
}
