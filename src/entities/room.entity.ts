import { BaseEntity, Column, Entity, Unique, PrimaryGeneratedColumn, CreateDateColumn, OneToMany, ManyToOne, JoinColumn, UpdateDateColumn } from "typeorm";
import { Message } from "./message.entity";
import { OrderItem } from "./order-item.entity";
import { User } from "./user.entity";

@Entity ("rooms")
export class Room extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;
    
    @ManyToOne( () => User)
    @JoinColumn({ name: 'sender_id' })
    sender!: User

    @Column({default:false})
    sender_delete!: boolean;

    @Column({default:0})
    sender_count!: number;
    
    @ManyToOne( () => User)
    @JoinColumn({ name: 'receiver_id' })
    receiver!: User

    @Column({default:false})
    receiver_delete!: boolean;

    @Column({default:0})
    receiver_count!: number;

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    created_at!: string | any;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    updated_at!: string | any;

    @OneToMany( () => Message, Message => Message.room)
    messages!: Message[];


    unreadMessages!: number;
    lastMessage!: Message;

}
