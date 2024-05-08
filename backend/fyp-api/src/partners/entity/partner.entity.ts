import { Field, ObjectType } from "@nestjs/graphql";
import { Account } from "src/accounts/entities/account.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

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

    @Field({nullable:true})
    @Column({nullable:true})
    accountId:number

    @Field(()=>Account,{nullable:true})
    @OneToOne(()=>Account,(account)=>account.partner)
    @JoinColumn()
    account:Account

    @Field()
    @CreateDateColumn()
    createdAt: Date;
    @UpdateDateColumn()
    @Field({nullable:true})
    updatedAt:Date
}