import { Injectable } from '@nestjs/common';
import {UserCreateDTO} from "../users/dto/user.createDTO";
import {UsersService} from "../users/users.service";
import { MyContext } from 'src/tg-bot/tg-bot.service';

@Injectable()
export class AuthService {
   
    constructor(private userService: UsersService) {}

    extractUserInfo(ctx:any): UserCreateDTO {
        const userInfo: UserCreateDTO = {
            telegramId: ctx.from?.id,
            username: ctx.from?.username || null,
        };

        ctx.session.userInfo = userInfo;

        return userInfo;
    }

    async registration(ctx: MyContext, UserDTO: UserCreateDTO) {
        ctx.session.userInfo = UserDTO;
        const candidate = await this.userService.getUserByTelegramId(UserDTO.telegramId);
        if (candidate) {
            return null;
        }
        const user = await this.userService.createUser({...UserDTO})

        console.log("Session data:", ctx.session);

        return user;
    }

}
