import { Injectable, UnauthorizedException } from '@nestjs/common';

import { LoginUserDto } from '../dto/login-user-dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuthResults } from '../response/auth-results';
import { AccountsService } from 'src/accounts/service/accounts.service';



@Injectable()
export class AuthService {
    constructor(
        private readonly accountService: AccountsService,
        private jwtService: JwtService) {
    }


    async validateUser(loginUserDto: LoginUserDto): Promise<any> {
        const user = await this.accountService.findOneByEmail(loginUserDto.email);
        if (user && await bcrypt.compare(loginUserDto.password, user.password)) {
            //update user last login 
            await this.accountService.updateLoginDate(loginUserDto.email)
            return user;


        }

    }
    
    async login(loginDto: LoginUserDto): Promise<AuthResults> {
        const user = await this.validateUser(loginDto);
        if (!user) {
            throw new UnauthorizedException('Invalid loggin credentials!')
        }
        const { password, ...results } = user
        const payload = {
            sub: results.id,
            username: results.email,
            role: results.role

        }
        console.log(payload)
        return {
            message: "Successfuly loggedin",
            id: results.id,
            username: results.email,
            role:results.role,
            access_token: await this.jwtService.signAsync(payload),
        }
    }
}
