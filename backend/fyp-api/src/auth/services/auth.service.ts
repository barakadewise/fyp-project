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
        private readonly teamService:TeamsService,
        private jwtService: JwtService) {
    }

    //function to validate user based on the roles
    async validateUser(loginUserDto: LoginUserDto): Promise<any> {
        const role: string = loginUserDto.role
        switch (role) {
            case "Partner": {
                const user = await this.partnerService.findOneByEmailOrPhone(loginUserDto.username);
                if (user && await bcrypt.compare(loginUserDto.password, user.password)) {
                    return this.login(user);

                }
              throw new UnauthorizedException('Inavalid credentials')
            }
            case "Youth": {
                const user = await this.youthService.findOneByEmailOrPhone(loginUserDto.username);
                if (user && await bcrypt.compare(loginUserDto.password, user.password)) {
                    return this.login(user);
                }
                throw new UnauthorizedException('Invalid Credentials');
            }
            case "Team":{
                const user = await this.teamService.findOneByEmailOrPhone(loginUserDto.username);
                if (user && await bcrypt.compare(loginUserDto.password, user.password)) {
                    return this.login(user);
                }
                throw new UnauthorizedException('Invalid Credentials');

            }
        }

    }

    async login(user: any): Promise<AuthResults> {
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
