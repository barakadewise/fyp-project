import { Field, ObjectType } from "@nestjs/graphql";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("admins")
@ObjectType()
export class Admin {
    @PrimaryGeneratedColumn()
    @Field()
    id: number;

    @Column()
    @Field()
    name: string;

    @Column({ nullable: true, unique: true })
    @Field()
    email: string;

    @Column()
    @Field()
    password: string;

    @Column({ nullable: true })
    @Field()
    is_superAdmin: boolean

    @CreateDateColumn()
    @Field()
    createdAt: string;

}