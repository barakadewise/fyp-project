import { Field, ObjectType } from '@nestjs/graphql';
import { Account } from 'src/accounts/entities/account.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('staffs')
@ObjectType()
export class Staff {
  @PrimaryGeneratedColumn()
  @Field()
  id: number;

  @Column({ nullable: true })
  @Field({ nullable: true })
  name: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  email: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  gender: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  status: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  accountId: number;

  @Field(() => Account)
  @OneToOne(() => Account, (account) => account.staff)
  @JoinColumn()
  account: Account;

  @CreateDateColumn()
  @Field()
  createdAt: string;

  @UpdateDateColumn({ nullable: true })
  @Field({ nullable: true })
  updatedAt: string;
}
