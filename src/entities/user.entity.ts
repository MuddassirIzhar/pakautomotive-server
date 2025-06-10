import { Column, PrimaryGeneratedColumn, Entity, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, OneToMany, Relation } from "typeorm";
import { Role } from "./role.entity";
import { Blog } from "./blog.entity";
import { Comment } from "./comment.entity";

@Entity("users")
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    firstName!: string;

    @Column()
    lastName!: string;

    @Column({
        unique: true
    })
    email!: string;

    @Column({select: false})
    password!: string;
    
    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    created_at!: string | any;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    updated_at!: string | any;

    @ManyToOne(() => Role)
    @JoinColumn({name: 'role_id'})
    role!: Role;
    
    @OneToMany( () => Blog, blog => blog.author)
    blogs!: Relation<Blog>[];
    
    @OneToMany( () => Comment, comment => comment.user)
    comments!: Relation<Comment>[];
}