import { Injectable } from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {Role} from "./models/roles.model";
import {createRoleDTO} from "./dto/createRoleDTO";

@Injectable()
export class RolesService {

    constructor(@InjectModel(Role) private readonly roleModel: typeof Role) {
    }

    async findRoleByValue(value:string):Promise<Role> {
        try {
            return this.roleModel.findOne({
                where:{
                    value:value
                }
            })
        }catch(e){
            console.log(e)
            return null;
        }
    }

    async getAll():Promise<Role[]> {
        try {
            return this.roleModel.findAll();
        }catch(e){
            console.log(e)
            return null;
        }
    }

    async delete(value:string):Promise<Role> {
        try {
            const role = await this.findRoleByValue(value);
            await role.destroy();
            return role;
        }catch(e){
            console.log(e)
            return null;
        }
    }

    async addRole(dto:createRoleDTO):Promise<Role> {
        try {
            return this.roleModel.create(dto);
        }catch (e) {
            console.log(e)
            return null;
        }
    }

    async changeRole(value:string,dto: createRoleDTO):Promise<Role> {
        try {
            const role = await this.findRoleByValue(value);
            role.set(dto)
        }catch(e){
            console.log(e)
            return null;
        }
    }
}
