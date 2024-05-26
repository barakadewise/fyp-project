import { Field, ObjectType } from "@nestjs/graphql";
import { Partner } from "src/partners/entity/partner.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('projects')
@ObjectType()
export class Project {
    @PrimaryGeneratedColumn()
    @Field()
    id: number;

    @Field({ nullable: true })
    @Column({ nullable: true })
    name: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    cost: number;

    @Field({ nullable: true })
    @Column({ nullable: true })
    duration: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    discription: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    status: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    funded: boolean;

    @Field({ nullable: true })
    @Column({ nullable: true })
    partnerName: string;

    @Field(() => Partner, { nullable: true })
    @ManyToOne(() => Partner, (partner) => partner.projet, { nullable: true })
    @JoinColumn()
    partner: Partner;

    @Field({ nullable: true })
    @Column({ nullable: true })
    partnerId: number;

    @Field({ nullable: true })
    @CreateDateColumn({ nullable: true })
    createdAt: Date;

    @Field({ nullable: true })
    @UpdateDateColumn({ nullable: true })
    updatedAt: Date;

}