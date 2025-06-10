import { BaseEntity, type Relation } from "typeorm";
import { OrderItem } from "./order-item.entity";
export declare class Order extends BaseEntity {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    total: number;
    created_at: string | any;
    order_items: Relation<OrderItem>[];
}
