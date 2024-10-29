import {Body, Controller, Delete, Get, Param, Post, Put} from '@nestjs/common';
import {UsersService} from "./users.service";
import {User} from "./users.model";
import {UserCreateDTO} from "./dto/user.createDTO";
import {ApiResponse} from "@nestjs/swagger";

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {

    }

    @Post("/register")
    async register(@Body() user: UserCreateDTO): Promise<User|boolean> {
        return await this.usersService.createUser(user);
    }

    @Put("/update/:userId")
    async update(@Body() updateData: UserCreateDTO,@Param("userId") userId : string): Promise<User|boolean> {
        return await this.usersService.updateUser(userId, updateData);
    }

    @Delete("/delete/:userId")
    async delete(@Param("userId") userId: string): Promise<User|boolean> {
        return await this.usersService.deleteUser(userId);
    }

    @ApiResponse({
        status: 200,
        description: 'The found record',
        type: [User],
    })
    @Get("/")
    async getAll(): Promise<User[]|boolean> {
        return await this.usersService.findAll()
    }

    @ApiResponse({
        status: 200,
        description: 'The found record',
        type: User,
    })
    @Get("/:userId")
    async getById(@Param("userId") userId: string): Promise<User|boolean> {
        return await this.usersService.findUserById(userId)
    }

}
