import { BaseEntity } from "typeorm";
import { Permission } from "./permission.entity";
export declare class Role extends BaseEntity {
    id: any;
    name: string;
    permissions: Permission[];
}
