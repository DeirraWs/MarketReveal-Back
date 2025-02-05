import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Category } from './model/category.model';
import { CategoryService } from './model/category.service';
import { SearchPropertiesCategoryService } from './search-properties-category/search-properties-category.service';
import { SearchPropertiesCategoryController } from './search-properties-category/search-properties-category.controller';

@Module({
  providers:
    [
      CategoryService,
      SearchPropertiesCategoryService
    ],
  controllers:
    [
      SearchPropertiesCategoryController
    ],
  imports: [SequelizeModule.forFeature([Category])],
  exports: [
    SearchPropertiesCategoryService
  ],
})
export class SearchPropertiesModule {}
