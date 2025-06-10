import { BaseEntity, Column, Entity, Unique, PrimaryGeneratedColumn, CreateDateColumn, OneToMany, type Relation } from "typeorm";
import { OrderItem } from "./order-item.entity";

export enum StatusEnum {
    ACTIVE = "active",
    INACTIVE = "inactive"
}

@Entity ("services")
export class Service extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column({
        type: "enum",
        enum: StatusEnum,
        default: [StatusEnum.ACTIVE]
    })
    status!: StatusEnum[];

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    created_at!: string | any;

    @OneToMany( () => OrderItem, OrderItem => OrderItem.order)
    // order_items!: OrderItem[];
    order_items!: Relation<OrderItem>[];

}
