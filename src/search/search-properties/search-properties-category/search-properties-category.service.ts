import { Inject, Injectable } from '@nestjs/common';
import { CategoryService } from '../model/category.service';
import { Category } from '../model/category.model';


@Injectable()
export class SearchPropertiesCategoryService {

  constructor(
    @Inject() private categoryService: CategoryService,
  ) {
  }

  async addNewCategory(value: string): Promise<Category> {
    return  await this.categoryService.addCategory(value);
  }

  async addSubCategoriesToCategory(values: string[], categoryId: string): Promise<Category[]> {
    return  await Promise.all(values.map(async (value)  => await this.categoryService.addSubcategory(value,categoryId)));
  }

  async deleteCategory(categoryId: string) {
    await this.categoryService.deleteCategory(categoryId);
  }

  async deleteSubCategory(subCategoryId: string) {
    await this.categoryService.deleteCategory(subCategoryId);
  }

  async getAllCategories(): Promise<Category[]> {
    return await this.categoryService.getAllCategories();
  }

  async getSubCategoriesByParentCategory(categoryId: string): Promise<Category[]> {
    return await this.categoryService.getSubcategoriesByCategory(categoryId)
  }

  async getCategoryByValue(value: string): Promise<Category> {
    return await this.categoryService.getCategoryByValue(value)
  }

  async getCategoryByID(id: string): Promise<Category> {
    return await this.categoryService.getCategoryById(id)
  }
}