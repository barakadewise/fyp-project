import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Column, CreateDateColumn, Entity, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

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


  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updateAt: Date


}
