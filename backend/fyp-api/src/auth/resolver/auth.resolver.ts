import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from '../services/auth.service';
import { LoginUserDto } from '../dto/login-user-dto';
import { AuthResults } from '../response/auth-results';



@Resolver()
export class AuthResolver {
    constructor(private readonly authService: AuthService) { }

    //function to loginUser 
    @Mutation(() => AuthResults)
    async login(@Args('loginUserDto') loginUserDto: LoginUserDto,@Context() Context): Promise<any> {
        return await this.authService.login(loginUserDto)

    }
  
}
