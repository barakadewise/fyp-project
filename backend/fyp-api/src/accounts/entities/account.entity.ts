import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Partner } from 'src/partners/entity/partner.entity';
import { Staff } from 'src/staff/entity/staff-entity';
import { Teams } from 'src/teams/entity/team.entity';
import { Youth } from 'src/youth/entity/youth.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne } from 'typeorm';

@Entity('accounts')
@ObjectType()
export class Account {
  @PrimaryGeneratedColumn()
  @Field()
  id: number

  @Field({nullable:true})
  @Column({unique:true})
  email: string;

  @Field({nullable:true})
  @Column({nullable:true})
  password:string

  @Field({nullable:true})
  @Column({nullable:true})
  role: string;

  @Field({nullable:true})
  @Column({nullable:true})
  lastlogin:Date

  @Field(()=>Teams,{nullable:true})
  @OneToOne(()=>Teams,(team)=>team.account,{onDelete:'CASCADE'})
  team:Teams


  @OneToOne(()=>Partner,(partner)=>partner.account,{onDelete:'CASCADE'})
  partner:Partner

  @OneToOne(()=>Staff,(staff)=>staff.account,{onDelete:'CASCADE'})
  staff:Staff
  
  @OneToOne(()=>Youth,(youth)=>youth.account,{onDelete:'CASCADE'})
  youth:Youth

  @CreateDateColumn({nullable:true})
  @Field({nullable:true})
  createdAt: Date;

  @UpdateDateColumn({nullable:true})
  @Field({nullable:true})
  updatedAt: Date;
}
