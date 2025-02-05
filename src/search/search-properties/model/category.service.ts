import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Category } from './category.model';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category) private readonly categoryModel: typeof Category,
  ) {}

  async getCategoryByValue(value: string): Promise<Category> {
    try {
      return await this.categoryModel.findOne({ where: { value:value } });
    } catch (e) {
      throw new InternalServerErrorException('Error while finding filters');
    }
  }

  async getCategoryById(id: string): Promise<Category> {
    try {
      return await this.categoryModel.findOne({ where: { id:id } });
    } catch (e) {
      throw new InternalServerErrorException('Error while finding filters');
    }
  }

  async addCategory(value: string): Promise<Category> {
    try {
      console.log(value);
      const res: Category = await this.categoryModel.create<Category>({
        value:value,
        parentId:null,
      });
      console.log(res);
      return res;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error while adding filters');
    }
  }

  async deleteCategory(categoryId: string): Promise<void> {
    try {
      const result = await this.categoryModel.destroy({ where: { id: categoryId } });
    } catch (error) {
      throw new InternalServerErrorException('Error while deleting filters');
    }
  }

  async addSubcategory(value: string, parentId: string): Promise<Category> {
    try {
      const parentCategory = await this.categoryModel.findByPk(parentId);
      if (!parentCategory) {
        throw new NotFoundException(`Category with ID ${parentId} not found`);
      }
      return await this.categoryModel.create({ value:value, parentId });
    } catch (error) {
      throw new InternalServerErrorException('Error while adding subcategory');
    }
  }

  async getAllCategories(): Promise<Category[]> {
    try {
      return await this.categoryModel.findAll({ where: { parentId: null } });
    } catch (error) {
      throw new InternalServerErrorException('Error while fetching categories');
    }
  }

  async getSubcategoriesByCategory(categoryId: string): Promise<Category[]> {
    try {
      return await this.categoryModel.findAll({ where: { parentId: categoryId } });
    } catch (error) {
      throw new InternalServerErrorException('Error while fetching subcategories');
    }
  }
}
