import { BaseEntity, Column, Entity, Unique, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, type Relation, ManyToOne, JoinColumn } from "typeorm";
import { Brand } from "./brand.entity";
import { SubCategory } from "./sub-category.entity";
import { Variant } from "./variant.entity";
import { ModelPros } from "./model-pros.entity";
import { ModelCons } from "./model-cons.entity";

export enum StatusEnum {
    ACTIVE = "active",
    INACTIVE = "inactive"
}

@Entity ("models")
export class Model extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column({ type: "varchar", length: 255, unique: true })
    slug!: string;

    @Column({ type: "varchar", length: 255 })
    heading!: string;
    
    @Column({ type: "text" })
    description!: string;

    @Column({ type: "text" })
    content!: string;

    @Column("simple-array", { nullable: true })
    images!: string[];
    
    @ManyToOne(() => Brand)
    @JoinColumn({name: 'brand_id'})
    brand!: Relation<Brand>;
    
    @ManyToOne(() => SubCategory)
    @JoinColumn({name: 'sub_category_id'})
    sub_category!: Relation<SubCategory>;
    
    @OneToMany( () => Variant, Variant => Variant.model)
    variants!: Relation<Variant>[];
    
    @OneToMany( () => ModelPros, ModelPros => ModelPros.model)
    pros!: Relation<ModelPros>[];

    @OneToMany( () => ModelCons, ModelCons => ModelCons.model)
    cons!: Relation<ModelCons>[];

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
