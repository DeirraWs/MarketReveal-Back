import {Module} from '@nestjs/common';
import {AuthController} from './auth.controller';
import {AuthService} from './auth.service';
import {UsersModule} from 'src/users/users.module';
import {JwtModule} from '@nestjs/jwt';
import {forwardRef} from '@nestjs/common';
import {RegistrationHandler} from "./tg/registrationHandler";
import {CommandModule} from "../tg-bot/command/command.module";
import {DialogModule} from "../tg-bot/dialog/dialog.module";
import {RegistrationDialog} from "./tg/registrationDialog";
import {MenuModule} from "../tg-bot/menu/menu.module";


@Module({
    controllers: [AuthController],
    providers:
        [
            AuthService,
            RegistrationHandler,
            RegistrationDialog
        ],
    imports: [
        forwardRef(() => UsersModule),
        JwtModule.register({
            secret: process.env.PRIVATE_KEY || 'SECRET',
            signOptions: {
                expiresIn: '24h'
            }
        }),
        forwardRef(()=> CommandModule) ,
        DialogModule,
        MenuModule
    ],
    exports: [
        AuthService,
        JwtModule,
    ]
})
export class AuthModule {
}
