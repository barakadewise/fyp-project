import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Teams } from 'src/teams/entity/team.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType()
@Entity('trainings')
export class Training {
  @PrimaryGeneratedColumn()
  @Field()
  id: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  session: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  description: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  duration: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  startDate: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  endDate: string;

  @Field()
  @Column({ default: 0 })
  noOfparticipants: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  teamsId: number;

  @ManyToOne(() => Teams, (team) => team.training)
  @JoinColumn()
  team: Teams;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updateAt: Date;
}
