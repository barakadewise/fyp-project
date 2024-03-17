import { Field, ObjectType } from "@nestjs/graphql";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('partners')
@ObjectType()
export class Partner {
    @PrimaryGeneratedColumn()
    @Field()
    id: number;

    @Field()
    @Column()
    name: string;

    @Field()
    @Column()
    location: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    phone: string;

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

    @Field()
    @CreateDateColumn()
    createdAt: Date;

}