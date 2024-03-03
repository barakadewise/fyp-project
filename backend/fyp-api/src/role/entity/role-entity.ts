import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('role')
@ObjectType()
export class Role{
    @PrimaryGeneratedColumn()
    @Field()
    id:number;

    @Field()
    @Column()
    name:string;
    
}