import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Teams } from 'src/teams/entity/team.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@ObjectType()
@Entity('trainings')
export class Training {
  @PrimaryGeneratedColumn()
  @Field()
  id: number

  @Field()
  @Column()
  session: string

  @Field()
  @Column()
  description: string

  @Field()
  @Column()
  duration: string

  @Field()
  @Column()
  noOfparticipants: number

  @ManyToOne(()=>Teams,(team)=>team.training)
  @JoinColumn()
  team:Teams

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updateAt: Date


}
