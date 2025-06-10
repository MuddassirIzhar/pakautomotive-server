import { BaseEntity, Column, Entity, Unique, PrimaryGeneratedColumn, CreateDateColumn, OneToMany, type Relation, ManyToOne, JoinColumn } from "typeorm";
import { Patient } from "./patient.entity";
import { User } from "./user.entity";

export enum PriorityEnum {
    HIGH = "high",
    MEDIUM = "medium",
    LOW = "low"
}

@Entity ("todos")
export class Todo extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne( () => Patient)
    @JoinColumn({ name: 'patient_id' })
    patient!: Patient

    @Column()
    name!: string;

    @CreateDateColumn()
    date!: string;

    @Column({
        type: "enum",
        enum: PriorityEnum,
        default: [PriorityEnum.LOW]
    })
    priority!: PriorityEnum[];
    
    @Column("boolean")
    waitlist!: boolean;

    @ManyToOne( () => User)
    @JoinColumn({ name: 'user_id' })
    user!: User

    @ManyToOne( () => User)
    @JoinColumn({ name: 'creator_id' })
    creator!: User

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    created_at!: string | any;

}
