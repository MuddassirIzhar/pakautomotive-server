import { BaseEntity, Column, Entity, Unique, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, type Relation, ManyToOne, JoinColumn } from "typeorm";
import { Category } from "./category.entity";

export enum StatusEnum {
    ACTIVE = "active",
    INACTIVE = "inactive"
}

@Entity ("sub_categories")
export class SubCategory extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column({ type: "varchar", length: 255 })
    slug!: string;

    @Column()
    logo!: string;
        
    @ManyToOne(() => Category)
    @JoinColumn({name: 'category_id'})
    category!: Relation<Category>;

    @Column({
        type: "enum",
        enum: StatusEnum,
        default: [StatusEnum.ACTIVE]
    })
    status!: StatusEnum[];

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
