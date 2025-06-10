import { BaseEntity } from "typeorm";
import { Message } from "./message.entity";
import { User } from "./user.entity";
export declare class Room extends BaseEntity {
    id: number;
    sender: User;
    sender_delete: boolean;
    sender_count: number;
    receiver: User;
    receiver_delete: boolean;
    receiver_count: number;
    created_at: string | any;
    updated_at: string | any;
    messages: Message[];
    unreadMessages: number;
    lastMessage: Message;
}
