import { BaseEntity, Column, Entity, Unique, PrimaryGeneratedColumn, CreateDateColumn, OneToMany, type Relation } from "typeorm";
import { OrderItem } from "./order-item.entity";

@Entity ("orders")
// @Unique('constraint_name', ['email'])
export class Order extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    first_name!: string;

    @Column()
    last_name!: string;

    @Column()
    email!: string;

    @Column()
    total!: number;

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    created_at!: string | any;

    @OneToMany( () => OrderItem, OrderItem => OrderItem.order)
    // order_items!: OrderItem[];
    order_items!: Relation<OrderItem>[];

}
