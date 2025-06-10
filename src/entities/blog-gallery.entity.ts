import { BaseEntity, Column, Entity, Unique, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, type Relation, ManyToOne, JoinColumn } from "typeorm";
import { Model } from "./model.entity";
import { Brand } from "./brand.entity";
import { Variant } from "./variant.entity";
import { User } from "./user.entity";
import { Comment } from "./comment.entity";
import { Blog } from "./blog.entity";


export enum StatusEnum {
    ACTIVE = "active",
    INACTIVE = "inactive"
}

export enum BlogStatusEnum {
    DRAFT = "draft",
    PUBLISHED = "published",
    ARCHIVED = "archived",
}

@Entity ("blog_gallery")
export class BlogGallery extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;
        
    @ManyToOne(() => Blog)
    @JoinColumn({name: 'blog_id'})
    blog!: Relation<Blog>;

    @Column({ nullable: true })
    file_type!: string;

    @Column({ nullable: true })
    file!: string;

}
