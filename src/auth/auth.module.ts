import {Module} from '@nestjs/common';
import {AuthService} from './auth.service';
import {UsersModule} from 'src/users/users.module';
import {forwardRef} from '@nestjs/common';
import {CommandModule} from "../tg-bot/command/command.module";
import {DialogModule} from "../tg-bot/dialog/dialog.module";
import {MenuModule} from "../tg-bot/menu/menu.module";


@Module({
    providers:
        [
            AuthService
        ],
    imports: [
        forwardRef(() => UsersModule),
        forwardRef(()=> CommandModule),
        DialogModule,
        MenuModule
    ],
    exports: [
        AuthService    
    ]
})
export class AuthModule {
}
