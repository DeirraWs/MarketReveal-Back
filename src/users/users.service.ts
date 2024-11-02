import {Inject, Injectable} from '@nestjs/common';
import {UserCreateDTO} from "./dto/user.createDTO";
import {User} from "./model/users.model";
import {InjectModel} from "@nestjs/sequelize";
import {RolesService} from "../roles/roles.service";

@Injectable()
export class UsersService {

    constructor(
        @InjectModel(User) private userModel: typeof User,
        @Inject(RolesService) private roleService: RolesService
    ) {
    }

    async createUser(data: UserCreateDTO): Promise<User> {
        try {
            const user = await this.userModel.create<User>(data);
            const role = await this.roleService.findRoleByValue("USER")
            await user.$set('roles',[role.id])
            return user
        } catch (e){
            console.log(e)
            return null;
        }
    }

    async updateUser(id: string, updateData: UserCreateDTO): Promise<User>{
        try {
            const user = await this.userIsExist(id)
            return  await user.update(updateData);
        } catch (e){
            console.log(e)
            return null;
        }
    }

    async deleteUser(id: string): Promise<User>{
        try {
            const user = await this.userIsExist(id)
            await user.destroy()
            return user;
        } catch (e){
            console.log(e)
            return null;
        }
    }

    async addRoleToUser(value: string, userId: string): Promise<User> {
        try {
            const user = await this.userIsExist(userId);
            const role = await this.roleService.findRoleByValue(value)
            await user.$add('roles',role.id)
            return await this.userIsExist(userId);
        }catch (e) {
            console.log(e)
            return null;
        }
    }

    async cancelRoleToUser(value: string, userId: string): Promise<User> {
        try {
            const user = await this.userIsExist(userId);
            const role = await this.roleService.findRoleByValue(value)
            await user.$remove('roles',role.id)
            return await this.userIsExist(userId);
        } catch (e) {
            console.log(e)
            return null;
        }
    }

    async findAll(): Promise<User[]> {
        try {
           return await this.userModel.findAll<User>({
               include: {
                   all: true,
               },
           });
        } catch (e){
            console.log(e)
            return null;
        }
    }

    async findUserById(userId: string) :Promise<User>{
        try {
            return this.userIsExist(userId);
        } catch (e) {
            console.log(e)
            return null;
        }
    }


    async userIsExist(id: string): Promise<User> {
        try {
            return await this.userModel.findOne({
                where:{
                    id: id
                },
                include:{
                    all:true
                }
            })
        } catch (e){
            console.log(e)
        }
    }


}
