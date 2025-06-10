import { BaseEntity, type Relation } from "typeorm";
import { Order } from "./order.entity";
export declare class OrderItem extends BaseEntity {
    id: number;
    product_title: string;
    price: number;
    quantity: number;
    order: Relation<Order>;
}
