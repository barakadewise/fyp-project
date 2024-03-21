import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from '../services/auth.service';
import { LoginUserDto } from '../dto/login-user-dto';
import { AuthResults } from '../response/auth-results';
import { Admin } from 'src/admin/entitity/admin.entity';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../guard/auth.guard';


@Resolver()
export class AuthResolver {
    constructor(private readonly authService: AuthService) { }

    //function to loginUser 
    @Mutation(() => AuthResults)
    async login(@Args('loginUserDto') loginUserDto: LoginUserDto): Promise<any> {
        return await this.authService.login(loginUserDto)

    }

   
}
