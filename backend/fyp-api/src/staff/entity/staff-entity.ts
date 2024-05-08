import { Field, ObjectType } from "@nestjs/graphql";
import { Account } from "src/accounts/entities/account.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("staffs")
@ObjectType()
export class Staff {
    @PrimaryGeneratedColumn()
    @Field()
    id: number;

    @Column()
    @Field()
    name: string;

    @Column({ nullable: true})
    @Field()
    email: string;
    
    @Column({ nullable: true, })
    @Field()
    gender: string;

    @Column({ nullable: true })
    @Field({ nullable: true })
    phone: string;

    @Column({ nullable: true })
    @Field({nullable:true})
    isAdmin: boolean;

    @Field()
 
    @Column({nullable:true})
    accountId:number
    
    @Field(()=>Account,{nullable:true})
    @OneToOne(()=>Account,(account)=>account.staff)
    @JoinColumn()
    account:Account

    @CreateDateColumn()
    @Field()
    createdAt: string;

    @UpdateDateColumn()
    @Field()
    updatedAt: string;
   
}