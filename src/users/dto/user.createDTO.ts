import {ApiProperty} from "@nestjs/swagger";

export class  UserCreateDTO {
    @ApiProperty({
        description: 'User name',
        type: String,
    })
    name: string;
    @ApiProperty({
        description: 'Email',
        type: String,
    })
    email: string;
    @ApiProperty({
        description: 'hashed password',
        type: String,
    })
    password: string;
}