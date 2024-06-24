import { Field, ObjectType } from "@nestjs/graphql";
import { Account } from "src/accounts/entities/account.entity";
import { Training } from "src/training/entities/training.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('teams')
@ObjectType()

export class Teams {
    @PrimaryGeneratedColumn()
    @Field()
    id: number;

    @Field({nullable:true})
    @Column({nullable:true})
    name: string;

    @Field({nullable:true})
    @Column({nullable:true})
    location: string;

    @Field({nullable:true})
    @Column({nullable:true})
    address: string;
    
    @Field({nullable:true})
    @Column({nullable:true})
    phone: string;

    @Field({nullable:true})
    @Column({nullable:true})
    email: string;

    @Field({nullable:true})
    @Column({nullable:true})
    status: string;

    @Field({nullable:true})
    @Column({nullable:true})
    accountId:number

    @OneToOne(()=>Account,(account)=>account.team)
    @JoinColumn()
    account:Account

    
    @ManyToOne(()=>Training,(training)=>training.team)
    training:[Training]
    

    @CreateDateColumn({nullable:true})
    @Field({nullable:true})
    createdAt:Date;

    @UpdateDateColumn({nullable:true})
    @Field({nullable:true})
    updatedAt:Date

}