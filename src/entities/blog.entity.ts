import { BaseEntity, Column, Entity, Unique, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, type Relation, ManyToOne, JoinColumn } from "typeorm";
import { Model } from "./model.entity";
import { Brand } from "./brand.entity";
import { Variant } from "./variant.entity";
import { User } from "./user.entity";
import { Comment } from "./comment.entity";
import { BlogGallery } from "./blog-gallery.entity";
import { BlogPros } from "./blog-pros.entity";
import { BlogCons } from "./blog-cons.entity";


export enum StatusEnum {
    ACTIVE = "active",
    INACTIVE = "inactive"
}

export enum BlogStatusEnum {
    DRAFT = "draft",
    PUBLISHED = "published",
    ARCHIVED = "archived",
}

@Entity ("blogs")
export class Blog extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;
        
    @ManyToOne(() => Model)
    @JoinColumn({name: 'model_id'})
    model!: Relation<Model>;

    @Column({ type: "varchar", length: 255 })
    title!: string;

    @Column({ type: "text" })
    content!: string;

    @ManyToOne(() => User, (user) => user.blogs, { eager: true, onDelete: "CASCADE" })
    author!: Relation<User>;

    @Column({ type: "varchar", length: 255, unique: true })
    slug!: string;

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    published_at!: Date;

    @Column("simple-array", { nullable: true })
    tags!: string[];

    @Column({ type: "varchar", nullable: true })
    image_url!: string;

    @Column({
        type: "enum",
        enum: BlogStatusEnum,
        default: [BlogStatusEnum.DRAFT]
    })
    status!: BlogStatusEnum[];

    @Column({ type: "int", default: 0 })
    read_time!: number;

    @Column({ type: "int", default: 0 })
    views!: number;

    @Column({ type: "int", default: 0 })
    likes!: number;

    @OneToMany(() => Comment, (comment) => comment.blog)
    comments!: Comment[];

    @OneToMany( () => BlogGallery, BlogGallery => BlogGallery.blog)
    images!: Relation<BlogGallery>[];

    @OneToMany( () => BlogPros, BlogPros => BlogPros.blog)
    pros!: Relation<BlogPros>[];

    @OneToMany( () => BlogCons, BlogCons => BlogCons.blog)
    cons!: Relation<BlogCons>[];

    @Column()
    meta_title!: string;

    @Column()
    meta_keywords!: string;

    @Column()
    meta_description!: string;

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    created_at!: string | any;
    
    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    updated_at!: string | any;

}
