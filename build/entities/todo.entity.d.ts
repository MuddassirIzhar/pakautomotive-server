import { BaseEntity } from "typeorm";
import { Patient } from "./patient.entity";
import { User } from "./user.entity";
export declare enum PriorityEnum {
    HIGH = "high",
    MEDIUM = "medium",
    LOW = "low"
}
export declare class Todo extends BaseEntity {
    id: number;
    patient: Patient;
    name: string;
    date: string;
    priority: PriorityEnum[];
    waitlist: boolean;
    user: User;
    creator: User;
    created_at: string | any;
}
