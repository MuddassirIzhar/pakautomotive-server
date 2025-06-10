import { BaseEntity, type Relation } from "typeorm";
import { Order } from "./order.entity";
export declare class LeadUser extends BaseEntity {
    id: number;
    product_title: string;
    price: number;
    quantity: number;
    order: Relation<Order>;
}
