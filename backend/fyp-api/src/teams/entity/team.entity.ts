import { Field, ObjectType } from "@nestjs/graphql";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('teams')
@ObjectType()

export class Teams {
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
    password:string;

    @Field()
    @Column()
    role:string;

    @CreateDateColumn()
    createdAt:Date;


}