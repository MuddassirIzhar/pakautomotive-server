import { BaseEntity, Column, Entity, Unique, PrimaryGeneratedColumn, CreateDateColumn, OneToMany, type Relation, ManyToOne, JoinColumn } from "typeorm";
import { Patient } from "./patient.entity";

@Entity ("patient_medical_reports")
export class PatientMedicalRecords extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne( () => Patient)
    @JoinColumn({ name: 'patient_id' })
    patient!: Patient

    @Column("text",{ nullable: false })
    file!: string;

    @Column({ nullable: true })
    file_type!: string;

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    created_at!: string | any;

}
