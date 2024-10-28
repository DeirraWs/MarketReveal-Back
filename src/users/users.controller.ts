import {Body, Controller, Get, Post} from '@nestjs/common';
import {UsersService} from "./users.service";
import {User} from "./users.model";
import {UserCreateDTO} from "./dto/user.createDTO";

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {

    }

    @Post("/register")
    async register(@Body() user: UserCreateDTO): Promise<User|boolean> {
        return await this.usersService.createUser(user);
    }

    @Get("/")
    async getAll(): Promise<User[]|boolean> {
        return await this.usersService.findAll()
    }
}
