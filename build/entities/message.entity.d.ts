import { BaseEntity } from "typeorm";
import { Room } from "./room.entity";
import { User } from "./user.entity";
export declare class Message extends BaseEntity {
    id: number;
    room: Room;
    sender: User;
    sender_delete: boolean;
    receiver: User;
    receiver_delete: boolean;
    message: string;
    file_type: string;
    file: string;
    type: string;
    status: string;
    read_at: Date;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
    self: any;
}
