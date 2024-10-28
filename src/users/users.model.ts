import { Table, Column, Model, DataType } from 'sequelize-typescript';

export interface IUser {
    id?: number;
    username: string;
    email: string;
    password: string;
}

@Table({
    tableName: 'users',
    timestamps: true, // Додає поля createdAt та updatedAt автоматично
})
export class User extends Model<User,IUser>{
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true,
        unique: true,
        allowNull: false,
    })
    id!: typeof DataType.UUID;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    username!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true,
    })
    email!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    password!: string;
}