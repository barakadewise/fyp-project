import { Field, InputType } from "@nestjs/graphql";
import { IsAlpha, IsNumberString, Length } from "class-validator";

@InputType()
export class YouthDto {
    @Field()
    @IsAlpha()
    fname: string;

    @Field()
    @IsAlpha()
    mname: string;

    @Field()
    @IsAlpha()
    lname: string;

    @Field({nullable:true})
    @IsNumberString()
    @Length(10,10)
    phone: string;

    @Field({nullable:true})
    @IsAlpha()
    address?: string;


    @Field()
    @IsAlpha()
    education: string;

    @Field()
    @IsAlpha()
    skills: string;

    @Field()
    @IsAlpha()
    location: string;

}