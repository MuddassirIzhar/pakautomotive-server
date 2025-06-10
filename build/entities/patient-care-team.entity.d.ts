import { BaseEntity } from "typeorm";
import { Patient } from "./patient.entity";
import { User } from "./user.entity";
export declare class PatientCareTeam extends BaseEntity {
    id: number;
    patient: Patient;
    user: User;
    created_at: string | any;
}
