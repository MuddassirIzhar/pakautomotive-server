import { BaseEntity, Column, Entity, Unique, PrimaryGeneratedColumn, ManyToOne, JoinColumn, type Relation } from "typeorm";
import { Order } from "./order.entity";

@Entity ("order_items")
// @Unique('constraint_name', ['product_title'])
export class OrderItem extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    product_title!: string;

    @Column({default:0})
    price!: number;

    @Column({default:0})
    quantity!: number;

    @ManyToOne(() => Order)
    @JoinColumn({name: 'order_id'})
    order!: Relation<Order>;
}
