import {Table, Column, Model, DataType} from 'sequelize-typescript';
import {ResultStructure} from "../../search/types/types";

export interface ITrackingResult {
    id: string;
    searchQuery: string;
    searchParameters: Object;
    count: number;
    res: IResult[]
}

export interface IResult {
    id: string;
    data: ResultStructure;
}

@Table({
    tableName: 'trackingResult',
    timestamps: true,
})
export class TrackingResult extends Model<TrackingResult, ITrackingResult> {

    @Column({
        type: DataType.UUID,
        primaryKey: true,
        unique: true,
        allowNull: false,
    })
    id!: string

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    searchQuery!: string;

    @Column({
        type: DataType.JSON,
        allowNull: false,
    })
    searchParameters!: Object; // трепа типізувати при появі системи параметрів пошуку

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        defaultValue: 0,
    })
    count?: number;

    @Column({
        type: DataType.JSON,
        defaultValue: [],
        allowNull: false,
    })
    res!: IResult[];

}