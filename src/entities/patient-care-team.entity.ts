import { BaseEntity, Column, Entity, Unique, PrimaryGeneratedColumn, CreateDateColumn, OneToMany, type Relation, ManyToOne, JoinColumn } from "typeorm";
import { OrderItem } from "./order-item.entity";
import { Patient } from "./patient.entity";
import { User } from "./user.entity";

@Entity ("patient_care_teams")
export class PatientCareTeam extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne( () => Patient)
    @JoinColumn({ name: 'patient_id' })
    patient!: Patient

    @ManyToOne( () => User)
    @JoinColumn({ name: 'user_id' })
    user!: User

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    created_at!: string | any;

}
