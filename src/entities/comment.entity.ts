import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";
import { Blog } from "./blog.entity";

@Entity ("comments")
export class Comment {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "text" })
    content!: string;

    @ManyToOne(() => User, (user) => user.comments, { eager: true, onDelete: "CASCADE" })
    user!: User;

    @ManyToOne(() => Blog, (blog) => blog.comments, { onDelete: "CASCADE" })
    blog!: Blog;
    
    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    created_at!: string | any;
    
    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    updated_at!: string | any;
}
