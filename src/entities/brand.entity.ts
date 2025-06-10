import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, Relation, ManyToMany, JoinTable} from "typeorm";
import { Model } from "./model.entity";
import { Category } from "./category.entity";

export enum StatusEnum {
    ACTIVE = "active",
    INACTIVE = "inactive"
}

@Entity ("brands")
export class Brand extends BaseEntity {
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

    @Column()
    logo!: string;

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

    @OneToMany( () => Model, Model => Model.brand)
    models!: Relation<Model>[];

    @ManyToMany(() => Category, (category) => category.id, {onDelete:"CASCADE"})
    @JoinTable({
        name: 'brand_categories',
        joinColumn: {
            name: 'brand_id',
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'category_id',
            referencedColumnName: 'id'
        },
    })
    categories!: Category[];
}
