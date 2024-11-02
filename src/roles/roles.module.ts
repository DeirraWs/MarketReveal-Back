import {Module} from '@nestjs/common';
import {RolesService} from './roles.service';
import {RolesController} from './roles.controller';
import {SequelizeModule} from "@nestjs/sequelize";
import {Role} from "./models/roles.model";
import {User} from "../users/model/users.model";
import {UserRoles} from "./models/userRole.model";

@Module({
    providers: [RolesService],
    controllers: [RolesController],
    imports: [
        SequelizeModule.forFeature([Role, User, UserRoles])
    ],
    exports: [
        RolesService
    ]
})
export class RolesModule {
}
