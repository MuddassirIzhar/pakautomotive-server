import { BaseEntity, type Relation } from "typeorm";
import { LeadUser } from "./lead-user.entity";
import { User } from "./user.entity";
import { Service } from "./service.entity";
export declare class Lead extends BaseEntity {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    credits: number;
    created_at: string | any;
    updated_at: string | any;
    user: User;
    service: Service;
    lead_users: Relation<LeadUser>[];
}
