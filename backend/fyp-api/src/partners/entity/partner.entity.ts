import { Field, ObjectType } from "@nestjs/graphql";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('partners')
@ObjectType()
export class Partner{
    @PrimaryGeneratedColumn()
    @Field()
    id: number;

    @Field()
    @Column()
    name: string;

    @Field()
    @Column()
    location: string;

    @Field()
    @Column()
    address: string;

    @Field()
    @Column()
    email: string;


    @Field()
    @Column()
    password: string;

    @Field()
    @CreateDateColumn()
    createdAt: Date;

}