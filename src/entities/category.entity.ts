import { BaseEntity, Column, Entity, Unique, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, type Relation } from "typeorm";
import { SubCategory } from "./sub-category.entity";

export enum StatusEnum {
    ACTIVE = "active",
    INACTIVE = "inactive"
}

@Entity ("categories")
export class Category extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

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
        
    @OneToMany( () => SubCategory, SubCategory => SubCategory.category)
    sub_categories!: Relation<SubCategory>[];

}
