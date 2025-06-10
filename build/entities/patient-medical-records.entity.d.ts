import { BaseEntity } from "typeorm";
import { Patient } from "./patient.entity";
export declare class PatientMedicalRecords extends BaseEntity {
    id: number;
    patient: Patient;
    file: string;
    file_type: string;
    created_at: string | any;
}
