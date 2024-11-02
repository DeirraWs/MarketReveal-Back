import {Module} from '@nestjs/common';
import {UsersController} from './users.controller';
import {UsersService} from './users.service';
import {SequelizeModule} from "@nestjs/sequelize";
import {User} from "./model/users.model";
import {RolesModule} from "../roles/roles.module";
import {Role} from "../roles/models/roles.model";
import {UserRoles} from "../roles/models/userRole.model";


@Module({
    imports: [
        SequelizeModule.forFeature([User,Role,UserRoles]),
        RolesModule
    ],
    controllers: [UsersController],
    providers: [UsersService],
    exports: [UsersService],
})
export class UsersModule {
}
