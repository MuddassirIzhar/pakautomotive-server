import { BaseEntity, type Relation } from "typeorm";
import { OrderItem } from "./order-item.entity";
export declare enum StatusEnum {
    ACTIVE = "active",
    INACTIVE = "inactive"
}
export declare class Service extends BaseEntity {
    id: number;
    name: string;
    status: StatusEnum[];
    created_at: string | any;
    order_items: Relation<OrderItem>[];
}
