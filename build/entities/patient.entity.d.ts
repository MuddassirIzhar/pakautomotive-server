import { BaseEntity, type Relation } from "typeorm";
import { PatientCareTeam } from "./patient-care-team.entity";
import { PatientMedicalRecords } from "./patient-medical-records.entity";
import { User } from "./user.entity";
export declare class Patient extends BaseEntity {
    id: number;
    name: string;
    dob: string;
    address: string;
    anotherAddress: string;
    details: string;
    creator: User;
    created_at: string | any;
    updated_at: string | any;
    care_team: Relation<PatientCareTeam>[];
    medical_records: Relation<PatientMedicalRecords>[];
}
