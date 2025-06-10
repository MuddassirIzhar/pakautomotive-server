import { BaseEntity, Column, Entity, Unique, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, type Relation, ManyToOne, JoinColumn } from "typeorm";
import { Model } from "./model.entity";
import { Brand } from "./brand.entity";
import { VariantColor } from "./variant-colors.entity";
import { VariantFeatureAndSpecification } from "./variant-feature-and-specification.entity";


export enum StatusEnum {
    ACTIVE = "active",
    INACTIVE = "inactive"
}

export enum TransmissionEnum {
    AUTOMATIC = "Manual",
    MANUAL = "Automatic",
	BOTH = "Automatic & Manual",
}

export enum FuelTypeEnum {
    PETROL = "Petrol",
    DIESEL = "Diesel",
    ELECTRIC = "Electric",
    HYBRID = "Hybrid",
}

@Entity ("variants")
export class Variant extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column({ type: "varchar", length: 255, unique: true })
    slug!: string;

    @Column()
    price!: number;

    @Column()
    year!: number;
        
    @Column()
    mileage_from!: number;
    
    @Column()
    mileage_to!: number;
    
    @Column()
    cc!: number;
    
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
        
    @ManyToOne(() => Model)
    @JoinColumn({name: 'model_id'})
    model!: Relation<Model>;
    
    @OneToMany( () => VariantColor, VariantColor => VariantColor.variant)
    colors!: Relation<VariantColor>[];

    @OneToMany( () => VariantFeatureAndSpecification, VariantFeatureAndSpecification => VariantFeatureAndSpecification.variant)
    variantFeatureAndSpecifications!: Relation<VariantFeatureAndSpecification>[];

    @Column({
        type: "enum",
        enum: StatusEnum,
        default: [StatusEnum.ACTIVE]
    })
    status!: StatusEnum[];
    
    @Column({
        type: "enum",
        enum: TransmissionEnum,
        default: [TransmissionEnum.MANUAL]
    })
    transmission!: TransmissionEnum[];

    @Column({
        type: "enum",
        enum: FuelTypeEnum,
        default: [FuelTypeEnum.PETROL]
    })
    fuel_type!: FuelTypeEnum[];

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
