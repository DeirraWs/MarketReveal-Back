import {Table, Column, Model, DataType, ForeignKey} from 'sequelize-typescript';
import {User} from "../../users/model/users.model";

@Table({
    tableName: 'favouriteProducts',
})
export class FavouriteProduct extends Model<FavouriteProduct> {

    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true,
        unique: true,
        allowNull: false,
    })
    id!: typeof DataType.UUID;

    @ForeignKey(()=>User)
    @Column({
        type: DataType.BIGINT,
        allowNull: false,
        unique: false,
    })
    telegramId!: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    title!: string;

    @Column({
        type: DataType.FLOAT,
        allowNull: true,
    })
    price!: number;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    currency!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    timePosted!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    url!: string;

    @Column({
        type: DataType.TEXT,
        allowNull: true,
    })
    tags!: string;

    @Column({
        type: DataType.TEXT,
        allowNull: true,
    })
    description!: string;
}
