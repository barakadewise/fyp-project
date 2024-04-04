import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AdminService } from 'src/admin/service/admin.service';
import { LoginUserDto } from '../dto/login-user-dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuthResults } from '../response/auth-results';
import { PartnersService } from 'src/partners/service/partners.service';
import { YouthService } from 'src/youth/service/youth.service';
import { TeamsService } from 'src/teams/service/teams.service';




@Injectable()
export class AuthService {
    constructor(private readonly adminService: AdminService,
        private readonly partnerService: PartnersService,
        private readonly youthService: YouthService,
        private readonly teamService: TeamsService,
        private jwtService: JwtService) {
    }

    //function to validate user based on the roles
    async validateUser(loginUserDto: LoginUserDto): Promise<any> {
        const role = loginUserDto.role
        switch (role) {
            case 'Youth': {
                const user = await this.youthService.findOneByEmailOrPhone(loginUserDto.username);
                if (user && await bcrypt.compare(loginUserDto.password, user.password)) {
                    return user;
                }
                return null;

            }
            case 'Partner': {
                const user = await this.partnerService.findOneByEmailOrPhone(loginUserDto.username);
                if (user && await bcrypt.compare(loginUserDto.password, user.password)) {
                    return user;
                }
                return null;

            }
            case 'Team': {
                const user = await this.teamService.findOneByEmailOrPhone(loginUserDto.username);
                if (user && await bcrypt.compare(loginUserDto.password, user.password)) {
                    return user;
                }
                return null;
            }

            //default return admin service
            default: {
                const user = await this.adminService.findOne(loginUserDto.username);
                if (user && await bcrypt.compare(loginUserDto.password, user.password)) {
                    return user;
                }
                return null;
            }
        }

    }

    //login user and resturn asign token
    async login(loginDto: LoginUserDto): Promise<AuthResults> {
        const user = await this.validateUser(loginDto);
        if (!user) {
            throw new UnauthorizedException('Invalid loggin credentials!')
        }
        const { password, ...results } = user
        const payload = {
            sub: results.id,
            username: results.email

        }
        console.log(payload)
        return {
            message: "Successfuly loggedin",
            id: results.id,
            username: results.email,
            access_token: await this.jwtService.signAsync(payload),
        }
    }
}
