import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AdminService } from 'src/admin/service/admin.service';
import { LoginUserDto } from '../dto/login-user-dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuthResults } from '../response/auth-results';
import { PartnersService } from 'src/partners/service/partners.service';
import { use } from 'passport';



@Injectable()
export class AuthService {
    constructor(private readonly adminService: AdminService,
        private readonly partnerService: PartnersService,
        private jwtService: JwtService) {
    }
    //funcrion to validate user
    async validateUser(loginUserDto: LoginUserDto): Promise<any> {
        if (loginUserDto.role==='Partner'){
            const user = await this.partnerService.findOne(loginUserDto.email)
            return {
                message:user.email
            }
        } 
        const user = await this.adminService.findOne(loginUserDto.email)
        if (user && await bcrypt.compare(loginUserDto.password, user.password)) {
            return this.login(loginUserDto)

        }
        throw new UnauthorizedException('Invalid credentials');

    }

    async login(loginUserDto: LoginUserDto): Promise<AuthResults> {
        const user = await this.adminService.findOne(loginUserDto.email)
        const { password, ...results } = user
        const payload = {
            id: results.id,
            name: results.name,
            email: results.email

        }
        return {
            message: "Successfuly loggedin",
            id: results.id,
            user: results.name,
            access_token: await this.jwtService.signAsync(payload),


        };

    }
}
