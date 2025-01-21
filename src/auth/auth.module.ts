import {Module} from '@nestjs/common';
import {AuthService} from './auth.service';
import {UsersModule} from 'src/users/users.module';
import {forwardRef} from '@nestjs/common';
import {CommandModule} from "../tg-bot/command/command.module";
import {DialogModule} from "../tg-bot/dialog/dialog.module";
import {MenuModule} from "../tg-bot/menu/menu.module";
import { RoleGuard } from './guard/roles-guard';


@Module({
    providers:
        [
            AuthService,
            RoleGuard
        ],
    imports: [
        forwardRef(() => UsersModule),
        forwardRef(()=> CommandModule),
        DialogModule,
        MenuModule
    ],
    exports: [
        AuthService,
        RoleGuard  
    ]
})
export class AuthModule {
}
