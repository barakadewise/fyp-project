import { Field, ObjectType } from "@nestjs/graphql";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

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

    @Column({ nullable: true })
    @Field({ nullable: true })
    phone: string;

    @Column({ nullable: true })
    @Field()
    is_superAdmin: boolean;

    @Field()
    @Column()
    password:string;

    @Column()
    @Field({ nullable: true })
    role: string;

   
    @CreateDateColumn()
    @Field()
    createdAt: string;

}