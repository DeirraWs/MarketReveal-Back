import { Injectable } from '@nestjs/common';
import {UserCreateDTO} from "../users/dto/user.createDTO";
import {UsersService} from "../users/users.service";
import { Context } from 'grammy';

@Injectable()
export class AuthService {
   
    constructor(private userService: UsersService) {}

    extractUserInfo(ctx:any): UserCreateDTO {
        return {
            telegramId: ctx.from?.id,
            username: ctx.from?.username || null
        };
    }

    async registration(ctx: Context, UserDTO: UserCreateDTO) {
        const candidate = await this.userService.getUserByTelegramId(UserDTO.telegramId);
        if (candidate) {
            await ctx.reply("User with this telegram ID already exists")
            return null;
        }
        const user = await this.userService.createUser({...UserDTO})
        return user;
    }

}
