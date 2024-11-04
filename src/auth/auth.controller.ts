import { Body, Controller, Post } from '@nestjs/common';
import {UserCreateDTO} from "../users/dto/user.createDTO";
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    
    constructor(private authService: AuthService) {}
    
    @Post('/login')
    login(@Body() UserDTO: UserCreateDTO) {
        return this.authService.login(UserDTO)
    }

    @Post('/registration')
    registration(@Body() UserDTO: UserCreateDTO) {
        return this.authService.registration(UserDTO)
    }
}
