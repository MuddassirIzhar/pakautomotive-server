import { BaseEntity, Column, Entity, Unique, PrimaryGeneratedColumn, CreateDateColumn, OneToMany, type Relation, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { PatientCareTeam } from "./patient-care-team.entity";
import { PatientMedicalRecords } from "./patient-medical-records.entity";
import { User } from "./user.entity";

@Entity ("patients")
export class Patient extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column()
    dob!: string;

    @Column()
    address!: string;

    @Column()
    anotherAddress!: string;

    @Column("text")
    details!: string;

    @ManyToOne( () => User)
    @JoinColumn({ name: 'creator_id' })
    creator!: User

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    created_at!: string | any;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    updated_at!: string | any;

    @OneToMany( () => PatientCareTeam, PatientCareTeam => PatientCareTeam.patient)
    care_team!: Relation<PatientCareTeam>[];

    @OneToMany( () => PatientMedicalRecords, PatientMedicalRecords => PatientMedicalRecords.patient)
    medical_records!: Relation<PatientMedicalRecords>[];

}
