import {Body, Controller, Delete, Get, Param, Post, Put} from '@nestjs/common';
import {RolesService} from "./roles.service";
import {Role} from "./models/roles.model";
import {createRoleDTO} from "./dto/createRoleDTO";

@Controller('roles')
export class RolesController {

    constructor(private readonly rolesService: RolesService) {}

    @Get("/:value")
    async GetRole(@Param('value') value: string): Promise<Role> {
        return await this.rolesService.findRoleByValue(value);
    }

    @Get("/")
    async GetAll(): Promise<Role[]> {
        return await this.rolesService.getAll()
    }

    @Post("/create")
    async CreateRole(@Body() dto: createRoleDTO): Promise<Role> {
        return await this.rolesService.addRole(dto)
    }

    @Delete("/:value")
    async DeleteRole(@Param('value') value: string): Promise<Role> {
        return await this.rolesService.delete(value)
    }

    @Put("/:value")
    async ChangeRole(@Param('value') value: string,@Body() dto: createRoleDTO): Promise<Role> {
        return await this.rolesService.changeRole(value,dto)
    }
}
