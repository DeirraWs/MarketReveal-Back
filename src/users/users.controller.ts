import {Body, Controller, Delete, Get, Param, Post, Put, UseGuards} from '@nestjs/common';
import {UsersService} from "./users.service";
import {User} from "./model/users.model";
import {UserCreateDTO} from "./dto/user.createDTO";
import {ApiResponse} from "@nestjs/swagger";
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles-guard';
import {Roles} from "../auth/roles-auth.decorator";

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {

    }

    @Post("/create")
    async register(@Body() user: UserCreateDTO): Promise<User> {
        return await this.usersService.createUser(user);
    }

    @Put("/update/:userId")
    async update(@Body() updateData: UserCreateDTO,@Param("userId") userId : string): Promise<User> {
        return await this.usersService.updateUser(userId, updateData);
    }

    @Delete("/delete/:userId")
    async delete(@Param("userId") userId: string): Promise<User> {
        return await this.usersService.deleteUser(userId);
    }

    @Put("/addRole/:userId")
    async addRoleToUser(@Body() body:{value:string}, @Param("userId") userId: string): Promise<User> {
        return await this.usersService.addRoleToUser(body.value, userId);
    }

    @Put("/canselRole/:userId")
    async canselUserRole(@Body() body:{value:string}, @Param("userId") userId: string): Promise<User> {
        return await this.usersService.cancelRoleToUser(body.value, userId);
    }

    @ApiResponse({
        status: 200,
        description: 'The found record',
        type: [User],
    })
    @Roles('USER')
    @UseGuards(RolesGuard)
    @Get("/")
    async getAll(): Promise<User[]> {
        return await this.usersService.findAll()
    }
    
    @ApiResponse({
        status: 200,
        description: 'The found record',
        type: User,
    })
    @Get("/:userId")
    async getById(@Param("userId") userId: string): Promise<User> {
        return await this.usersService.findUserById(userId)
    }

}
