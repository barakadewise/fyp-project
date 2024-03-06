import { Field, ObjectType } from "@nestjs/graphql";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('youth')
@ObjectType()
export class Youth{
    @PrimaryGeneratedColumn()
    @Field()
    id:number

    @Field()
    @Column()
    fname: string;

    @Field()
    @Column()
    mname: string;

    @Field()
    @Column()
    lname: string;

    @Field({nullable:true})
    @Column()
    address?: string;

    @Field()
    @Column()
    education: string;

    @Field()
    @Column()
    skills: string;

    @Field()
    location: string;

    @Field()
    @Column({unique:true,nullable:true})
    email: string;

    @Field()
    @Column({nullable:false})
    password:string

    @Field()
    @CreateDateColumn()
    createdAt:Date;
    
}