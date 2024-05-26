import { Field, InputType } from "@nestjs/graphql";
import { IsAlpha, IsNumberString, Length } from "class-validator";

@InputType()
export class PartnerDto {
    @Field()
    @IsAlpha()
    name: string;

    @Field()
    @IsAlpha()
    location: string;

 
    @Field()
    @IsNumberString()
    @Length(10,10)
    phone: string;
    
    @Field()
    @IsAlpha()
    address: string;

    @Field()
    @IsAlpha()
    status:string
}