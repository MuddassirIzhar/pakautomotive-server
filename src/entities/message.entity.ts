import { BaseEntity, Column, Entity, Unique, PrimaryGeneratedColumn, CreateDateColumn, OneToMany, ManyToOne, JoinColumn, UpdateDateColumn } from "typeorm";
import { Room } from "./room.entity";
import { User } from "./user.entity";

@Entity ("messages")
export class Message extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne( () => Room)
    @JoinColumn({ name: 'room_id' })
    room!: Room

    @ManyToOne( () => User)
    @JoinColumn({ name: 'sender_id' })
    sender!: User

    @Column({default:false})
    sender_delete!: boolean;
    
    @ManyToOne( () => User)
    @JoinColumn({ name: 'receiver_id' })
    receiver!: User

    @Column({default:false})
    receiver_delete!: boolean;

    @Column("text",{ nullable: false })
    message!: string;

    @Column({ nullable: true })
    file_type!: string;

    @Column({ nullable: true })
    file!: string;

    @Column({default:"text"})
    type!: string;

    @Column({default:"sent"})
    status!: string;

    @CreateDateColumn({ default:null, nullable: true, type: "timestamp" })
    read_at!: Date;

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    created_at!: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    updated_at!: Date;

    @CreateDateColumn({ default:null, nullable: true, type: "timestamp"})
    deleted_at!: Date;



    self: any;

}
