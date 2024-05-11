import { Field, InputType } from "@nestjs/graphql";
import { IsAlpha, IsNumberString, IsString } from "class-validator";

@InputType()
export class TeamsDto {
    @Field()
    @IsAlpha()
    name: string;

    @Field()
    @IsString()
    location: string;

    @Field()
    @IsString()
    address: string;

    @Field()
    @IsNumberString()
    phone: string;

    @Field()
    @IsAlpha()
    status: string;



}