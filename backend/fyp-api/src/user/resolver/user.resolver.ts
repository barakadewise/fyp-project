import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UserService } from '../service/user.service';
import { User } from '../entities/user.entity';
import { CreateUserInput } from '../dto/create-user.input';


@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  //create youth resolver
  @Mutation(() => User)
 async createYouth(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.userService.createYouth(createUserInput);
  }

  
  //create partner resolver
  @Mutation(() => User)
 async createPartner(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.userService.createPartner(createUserInput);
  }

  
  //create team resolver
  @Mutation(() => User)
 async createTeam(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.userService.createYouth(createUserInput);
  }


  // @Query(() => [User], { name: 'user' })
  // findAll() {
  //   return this.userService.findAll();
  // }

  // @Query(() => User, { name: 'user' })
  // findOne(@Args('id', { type: () => Int }) id: number) {
  //   return this.userService.findOne(id);
  // }


  // @Mutation(() => User)
  // removeUser(@Args('id', { type: () => Int }) id: number) {
  //   return this.userService.remove(id);
  // }
}
