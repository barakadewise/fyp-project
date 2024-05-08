import { Field, ObjectType } from "@nestjs/graphql";
import { Account } from "src/accounts/entities/account.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

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

    @Field({nullable:true})
    @Column({nullable:true})
    accountId:number

    @Field(()=>Account,{nullable:true})
    @OneToOne(()=>Account,(account)=>account.team)
    @JoinColumn()
    account:Account


    @CreateDateColumn({nullable:true})
    @Field({nullable:true})
    createdAt:Date;

    @UpdateDateColumn()
    @Field({nullable:true})
    updatedAt:Date

}