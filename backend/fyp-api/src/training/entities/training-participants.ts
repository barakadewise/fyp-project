import { Field, ObjectType } from "@nestjs/graphql"
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { Training } from "./training.entity"
import { Youth } from "src/youth/entity/youth.entity"

@ObjectType()
@Entity('training_participants')
export class TrainingParticipants {
    @PrimaryGeneratedColumn()
    @Field()
    id: number

    @Column({default:false})
    @Field()
    isAproved:boolean

    @Field({ nullable: true })
    @Column({ nullable: true })
    trainingName: string

    @Field({ nullable: true })
    @Column({ nullable: true })
    youthName: string

    @Field({ nullable: true })
    @Column({ nullable: true })
    youthId: number

    @Field({ nullable: true })
    @Column({ nullable: true })
    trainingId: number

    @OneToMany(() => Youth, (training) => training, { onDelete: 'CASCADE' })
    @JoinColumn()
    youth: [Youth]

    @ManyToOne(() => Training, (training) => training, { onDelete: 'CASCADE' })
    @JoinColumn()
    training: Training

}