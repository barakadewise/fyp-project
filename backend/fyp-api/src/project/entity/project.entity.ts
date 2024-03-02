import { Field, ObjectType } from "@nestjs/graphql";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('projects')
@ObjectType()
export class Project {
    @PrimaryGeneratedColumn()
    @Field()
    id: number;

    @Field()
    @Column()
    name: string;

    @Field()
    @Column()
    cost: number;

    @Field()
    @Column()
    duration: string;

    @Field()
    @Column()
    status: string;

    @Field()
    @Column()
    funded: boolean;
    
    @Field()
    @CreateDateColumn()
    createdAt: Date;

}