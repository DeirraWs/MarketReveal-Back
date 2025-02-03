import {Table, Column, Model, DataType, BelongsToMany} from 'sequelize-typescript';
import {ApiProperty} from "@nestjs/swagger";
import {User} from "../../users/model/users.model";
import {UserRoles} from "./userRole.model";

export interface IRole {
    value:string;
    discription:string;
}

@Table({
    tableName: 'roles',
    timestamps: true, // Додає поля createdAt та updatedAt автоматично
})
export class Role extends Model<Role,IRole>{

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
    id!: string;

    @ApiProperty({
        example: 'USER',
        description: 'unique role value',
    })
    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true,
    })
    value!: string;

    @ApiProperty({
        example: 'casual client',
        description: 'description',
    })
    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true,
    })
    description!: string;

    @BelongsToMany(()=>User,()=>UserRoles)
    users!: User[];
}