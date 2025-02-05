import { Column, DataType, ForeignKey, HasMany, Model, Table } from 'sequelize-typescript';

export interface ICategory {
  id: string;
  value: string;
  parentId?: string|null;
}

@Table({ tableName: 'categories', timestamps: true })
export class Category extends Model<Category,ICategory> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
    unique: true,
    allowNull: false,
  })
  id!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  value: string;

  @ForeignKey(() => Category)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  parentId: string | null;

  @HasMany(() => Category)
  subcategories: Category[];
}
