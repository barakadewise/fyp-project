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

    @Column({nullable:true})
    @Field({nullable:true})
    phone: string;

    @Column()
    @Field()
    password: string;

    @Column({ nullable: true })
    @Field()
    is_superAdmin: boolean

    @Column()
    @Field({nullable:true})
    role:string;

    @CreateDateColumn()
    @Field()
    createdAt: string;

}