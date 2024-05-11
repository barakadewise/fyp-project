import { Field, ObjectType } from "@nestjs/graphql";
import { Account } from "src/accounts/entities/account.entity";
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
    @Column({nullable:true})
    address?: string;

    @Field()
    @Column()
    education: string;

    @Field({nullable:true})
    @Column({nullable:true})
    gender: string;

    @Field()
    @Column()
    skills: string;

    @Field({nullable:true})
    @Column({nullable:true})
    location: string;
    
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

}