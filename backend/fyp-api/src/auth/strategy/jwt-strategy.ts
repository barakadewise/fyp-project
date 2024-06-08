import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable,} from '@nestjs/common';
import { jwtConstant } from 'constants/secret.';
import { AccountsService } from 'src/accounts/service/accounts.service';
import { Role } from 'utils/roles-enums';



@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtConstant.secret,
        });
    }

    async validate(payload: any) {
        return { 
            sub: payload.sub,
            username: payload.username,
            expIn:payload.exp,
            role:payload.role
             
             }
    }
}