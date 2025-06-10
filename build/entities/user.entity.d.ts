import { Role } from "./role.entity";
export declare class User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    created_at: string | any;
    updated_at: string | any;
    role: Role;
}
