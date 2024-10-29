import {Inject, Injectable} from '@nestjs/common';
import {UserCreateDTO} from "./dto/user.createDTO";
import {User} from "./users.model";

@Injectable()
export class UsersService {

    constructor(
        @Inject("USER_MODEL")
        private userModel: typeof User
    ) {
    }

    async userIsExist(id: string): Promise<User> {
        try {
            return await this.userModel.findOne({
                where:{
                    id: id
                }
            })
        } catch (e){
            console.log(e)
        }
    }

    async findAll(): Promise<User[]| boolean> {
        try {
           return await this.userModel.findAll<User>();
        } catch (e){
            console.log(e)
            return false;
        }
    }

    async createUser(data: UserCreateDTO): Promise<User|boolean> {
        try {
            return await this.userModel.create<User>(data);
        } catch (e){
            console.log(e)
            return false;
        }
    }

    async updateUser(id: string, updateData: UserCreateDTO): Promise<User|boolean>{
        try {
            const user = await this.userIsExist(id)
            return  await user.update(updateData);
        } catch (e){
            console.log(e)
            return false;
        }
    }

    async deleteUser(id: string): Promise<User|boolean>{
        try {
            const user = await this.userIsExist(id)
            await user.destroy()
            return user;
        } catch (e){
            console.log(e)
            return false;
        }
    }

    async findUserById(userId: string) {
        try {
            return this.userIsExist(userId);
        } catch (e) {
            console.log(e)
            return false;
        }
    }
}
