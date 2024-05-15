import { Field, InputType } from "@nestjs/graphql";
import { IsAlpha, IsNumberString, IsString, Length } from "class-validator";

@InputType()
export class YouthDto {
    @Field()
    @IsString()
    fname: string;

    @Field()
    @IsString()
    mname: string;

    @Field()
    @IsString()
    lname: string;

    @Field({ nullable: true })
    @IsNumberString()
    @Length(10, 10)
    phone: string;

    @Field()
    @IsString()
    gender: string;

    @Field({ nullable: true })
    @IsString()
    address?: string;

    @Field()
    @IsAlpha()
    education: string;

    @Field()
    @IsAlpha()
    skills: string;

    @Field()
    @IsString()
    location: string;

}