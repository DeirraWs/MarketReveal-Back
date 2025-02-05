import { Body, Controller, Delete, Get, Inject, Param, Post, Put, UseGuards } from '@nestjs/common';
import { SearchPropertiesCategoryService } from './search-properties-category.service';
import { Category } from '../model/category.model';
import { CreateCategoryDto } from '../model/dto/dto';


@Controller('category')
export class SearchPropertiesCategoryController {
  constructor(@Inject() private readonly searchPropertiesCategoryService: SearchPropertiesCategoryService) {

  }

  @Post("/create")
  async create(@Body() dto: CreateCategoryDto): Promise<Category> {
    return await this.searchPropertiesCategoryService.addNewCategory(dto.name);
  }

  @Post("/create/sub")
  async createSub(@Body() dto: CreateCategoryDto): Promise<Category[]> {
    return await this.searchPropertiesCategoryService.addSubCategoriesToCategory([dto.name],dto.parentId);
  }

  @Get("/")
  async getAll(): Promise<Category[]> {
    return await this.searchPropertiesCategoryService.getAllCategories()
  }

  @Get("/:sub")
  async getAllSub(@Param("sub") parentId:string): Promise<Category[]> {
    return await this.searchPropertiesCategoryService.getSubCategoriesByParentCategory(parentId)
  }



}
