import { BaseEntity } from "typeorm";
import { Patient } from "./patient.entity";
import { User } from "./user.entity";
export declare class Alert extends BaseEntity {
    id: number;
    patient: Patient;
    name: string;
    date: string;
    time: string;
    creator: User;
    created_at: string | any;
}
