import { ForbiddenException, Injectable } from "@nestjs/common";
import { UsersService } from "src/users/users.service";
import { MyContext } from "src/tg-bot/tg-bot.service";

@Injectable()
export class RoleGuard {
    constructor(private readonly usersService: UsersService) {}

    async checkRoles(ctx: MyContext, requiredRoles: string[]): Promise<boolean> {
        const telegramUserId = ctx.message?.from.id;

        if (!telegramUserId) {
            throw new ForbiddenException('User ID is not found in session');
        }

        const user = await this.usersService.getUserByTelegramId(telegramUserId);

        if (!user) {
            throw new ForbiddenException('User not found in the system');
        }

        const userRoles = user.roles?.map((role) => role.value);
        const hasRequiredRole = requiredRoles.some((role) => userRoles.includes(role));

        if (!hasRequiredRole) {
            ctx.reply('Access denied')
            throw new ForbiddenException('Access denied');
        }

        return true;
    }
}