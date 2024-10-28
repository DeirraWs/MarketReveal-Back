import {Inject, Injectable} from '@nestjs/common';
import {UserCreateDTO} from "./dto/user.createDTO";
import {User} from "./users.model";
import {DataTypes} from "sequelize";

@Injectable()
export class UsersService {

    constructor(
        @Inject("USER_MODEL")
        private userModel: typeof User
    ) {
    }

    async userIsExist(id: typeof DataTypes.UUID): Promise<User> {
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

    async updateUser(id: typeof DataTypes.UUID, updateData: UserCreateDTO): Promise<User|boolean>{
        try {
            const user = await this.userIsExist(id)
            return  await user.update(updateData);
        } catch (e){
            console.log(e)
            return false;
        }
    }

}
