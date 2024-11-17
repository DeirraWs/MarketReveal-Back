import {HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import {UserCreateDTO} from "../users/dto/user.createDTO";
import {UsersService} from "../users/users.service";
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from "bcryptjs";
import {User} from "../users/model/users.model";

@Injectable()
export class AuthService {

    constructor(private userService: UsersService, private jwtService: JwtService) {}

    async login(UserDTO: UserCreateDTO) {    
        const user = await this.validateUser(UserDTO)
        return this.generateToken(user)
    }

    async registration(UserDTO: UserCreateDTO) {
        const candidate = await this.userService.getUserByEmail(UserDTO.email);
        if (candidate) {
            throw new HttpException("User with this E-mail already exists", HttpStatus.BAD_REQUEST)
        }
        const hashPassword = await bcrypt.hash(UserDTO.password, 5);
        const user = await this.userService.createUser({...UserDTO, password: hashPassword})
        return this.generateToken(user)
    }

    private async generateToken(user: User) {
        const payload = {email: user.email, name: user.username, id:user.id, roles: user.roles}
        return {
            token: this.jwtService.sign(payload)
        }
    }

    private async validateUser(userDTO: UserCreateDTO) {
        const user = await this.userService.getUserByEmail(userDTO.email)
        const passwordEquals = await bcrypt.compare(userDTO.password, user.password)
        if (user && passwordEquals) {
            return user
        }
        throw new UnauthorizedException({message: "Incorrect email or password"})
    }
}
