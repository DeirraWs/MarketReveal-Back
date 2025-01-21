import {Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import {Role} from "./roles.model";
import {User} from "../../users/model/users.model";


@Table({
    tableName: 'userRoles',
    timestamps: true, // Додає поля createdAt та updatedAt автоматично
})
export class UserRoles extends Model<UserRoles>{


    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true,
        unique: true,
        allowNull: false,
    })
    id!: typeof DataType.UUID;

    @ForeignKey(()=>Role)
    @Column({
        type: DataType.UUID,
    })
    roleId!: string;

    @ForeignKey(()=>User)
    @Column({
        type: DataType.UUID,
    })
    userId!: string;

}