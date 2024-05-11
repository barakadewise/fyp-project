import { Field, InputType } from "@nestjs/graphql"
import { IsAlpha, IsNumberString, Length, isAlpha } from "class-validator";


@InputType()
export class StaffInputDto {
    @Field()
    @IsAlpha()
    name: string;

    @Field()
    @IsAlpha()
    gender: string;
    
    @Field()
    @IsNumberString()
    @Length(10,10)
    phone: string; 
    
    @Field()
    @IsAlpha()
    status:string
}