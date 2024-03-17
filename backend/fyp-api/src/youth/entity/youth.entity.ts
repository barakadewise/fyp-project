import { Field, ObjectType } from "@nestjs/graphql";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('youth')
@ObjectType()
export class Youth {
    @PrimaryGeneratedColumn()
    @Field()
    id: number

    @Field()
    @Column()
    fname: string;

    @Field()
    @Column()
    mname: string;

    @Field()
    @Column()
    lname: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    phone?: string;

    @Field({ nullable: true })
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
    @Column({ unique: true, nullable: true })
    email: string;

    @Column()
    @Field()
    password: string;
    role: string;

    @Field()
    @CreateDateColumn()
    createdAt: Date;

}