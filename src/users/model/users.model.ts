import {Table, Column, Model, DataType, BelongsToMany} from 'sequelize-typescript';
import {ApiProperty} from "@nestjs/swagger";
import {Role} from "../../roles/models/roles.model";
import {UserRoles} from "../../roles/models/userRole.model";

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

    @ApiProperty(
        {
            description: 'UUID',
        }
    )
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true,
        unique: true,
        allowNull: false,
    })
    id!: typeof DataType.UUID;

    @ApiProperty()
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    username!: string;

    @ApiProperty()
    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true,
    })
    email!: string;

    @ApiProperty()
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    password!: string;

    @BelongsToMany(()=>Role,()=>UserRoles)
    roles!: Role[];
}