import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, type Relation, ManyToOne, JoinColumn } from "typeorm";
import { Blog } from "./blog.entity";



@Entity ("blog_pros")
export class BlogPros extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;
        
    @ManyToOne(() => Blog)
    @JoinColumn({name: 'blog_id'})
    blog!: Relation<Blog>;

    @Column({ nullable: true })
    value!: string;
}
