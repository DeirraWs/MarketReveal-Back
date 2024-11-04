import {Module} from '@nestjs/common';
import {UsersController} from './users.controller';
import {UsersService} from './users.service';
import {SequelizeModule} from "@nestjs/sequelize";
import {User} from "./model/users.model";
import {RolesModule} from "../roles/roles.module";
import {Role} from "../roles/models/roles.model";
import {UserRoles} from "../roles/models/userRole.model";
import { AuthModule } from 'src/auth/auth.module';
import { forwardRef } from '@nestjs/common';



@Module({
    imports: [
        SequelizeModule.forFeature([User,Role,UserRoles]),
        RolesModule,
        forwardRef( () => AuthModule),
    ],
    controllers: [UsersController],
    providers: [UsersService],
    exports: [UsersService],
})
export class UsersModule {
}
