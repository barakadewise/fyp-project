import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Project } from 'src/project/entity/project.entity';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('installments')
@ObjectType()
export class Installment {
  @PrimaryGeneratedColumn()
  @Field()
  id: number

  @Column({ nullable: true })
  @Field({ nullable: true })
  projectName: string

  @Column({ nullable: true })
  @Field({ nullable: true })
  payment_Ref: string

  @Column({ nullable: true })
  @Field({ nullable: true })
  installment_phase: number

  @Column({ nullable: true })
  @Field({ nullable: true })
  projectCost: number

  @Column({ nullable: true })
  @Field({ nullable: true })
  paid: number

  @Column({ nullable: true })
  @Field({ nullable: true })
  remainAmount: number

  @Column({ nullable: true })
  @Field({ nullable: true })
  status: string

  @Column({ nullable: true })
  @Field({ nullable: true })
  total_installments: number

  @ManyToOne(() => Project, (project) => project.installments)
  @Field(() => Project, { nullable: true })
  project: Project

  @CreateDateColumn({
    type: "timestamp without time zone",
    nullable: true,
  })
  @Field({ nullable: true })
  createdAt: Date

  @UpdateDateColumn({
    type: "timestamp without time zone",
    nullable: true,
  })
  @Field({ nullable: true })
  updatedAt: Date


}
