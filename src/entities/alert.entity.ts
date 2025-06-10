import { BaseEntity, Column, Entity, Unique, PrimaryGeneratedColumn, CreateDateColumn, OneToMany, type Relation, ManyToOne, JoinColumn } from "typeorm";
import { Patient } from "./patient.entity";
import { User } from "./user.entity";

@Entity ("alerts")
export class Alert extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne( () => Patient)
    @JoinColumn({ name: 'patient_id' })
    patient!: Patient

    @Column()
    name!: string;

    @CreateDateColumn()
    date!: string;

    @Column()
    time!: string;

    @ManyToOne( () => User)
    @JoinColumn({ name: 'creator_id' })
    creator!: User

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    created_at!: string | any;


}
