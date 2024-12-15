import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "./roles-auth.decorator";
import { UsersService } from "src/users/users.service";
import { MyContext } from "src/tg-bot/tg-bot.service";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private usersService: UsersService
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        
        const requiredRoles = this.reflector.get<string[]>(ROLES_KEY, context.getHandler());

        if (!requiredRoles) {
            return true;
        }

        
        const ctx = context.switchToRpc().getContext<MyContext>();
        const telegramUserId = ctx?.from?.id;
        if (!telegramUserId) {
            throw new ForbiddenException('Unable to extract user ID from Telegram context');
        }

        
        const user = await this.usersService.getUserByTelegramId(telegramUserId);

        if (!user) {
            throw new ForbiddenException('User not found in the system');
        }

        
        const userRoles = user.roles?.map((role) => role.value);
        const hasRequiredRole = requiredRoles.some((role) => userRoles.includes(role));

        if (!hasRequiredRole) {
            throw new ForbiddenException('Access denied');
        }

        return true;
    }
}
