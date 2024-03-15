import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "../services/auth.service";
import { LoginUserDto } from "../dto/login-user-dto";
import { UnauthorizedException } from "@nestjs/common";

export class LocalStrtegy extends PassportStrategy(Strategy){
    constructor(private authService:AuthService){
        super();
    }

    //function for validation
    async validate(loginUserDto:LoginUserDto):Promise<any>{
        const user =await this.authService.validateUser(loginUserDto)
        if(!user){
            throw new UnauthorizedException();
        }
        return user;
    }
}