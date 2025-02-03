import {ApiProperty} from "@nestjs/swagger";

export class  UserCreateDTO {
    @ApiProperty({
        description: 'User name',
        type: String,
    })
    username: string;
    @ApiProperty({
        description: ' user telegram id',
        type: String,
    })
    telegramId: number;
}