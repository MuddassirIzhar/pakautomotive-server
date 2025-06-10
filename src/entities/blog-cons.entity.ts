import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, type Relation, ManyToOne, JoinColumn } from "typeorm";
import { Blog } from "./blog.entity";



@Entity ("blog_cons")
export class BlogCons extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;
        
    @ManyToOne(() => Blog)
    @JoinColumn({name: 'blog_id'})
    blog!: Relation<Blog>;

    @Column({ nullable: true })
    value!: string;
}
