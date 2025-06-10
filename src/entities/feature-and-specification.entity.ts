import { BaseEntity, Column, Entity, Unique, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, type Relation } from "typeorm";
import { SubCategory } from "./sub-category.entity";
import { VariantFeatureAndSpecification } from "./variant-feature-and-specification.entity";

export enum TypeEnum {
    FEATURE = "feature",
    SPECIFICATION = "specification",
}

export enum CategoryEnum {
    DIMENSIONS = "Dimensions",
    ENGINE_MOTOR = "Engine/Motor",
    TRANSMISSION = "Transmission",
    STEERING = "Steering",
    SUSPENSION_BRAKES = "Suspension & Brakes",
    WHEELS_TYRES = "Wheels & Tyres",
    FUEL_ECONOMY = "Fuel Economy",
    SAFETY = "Safety",
    EXTERIOR = "Exterior",
    INSTRUMENTATION = "Instrumentation",
    INFOTAINMENT = "Infotainment",
    COMFORT_CONVENIENCE = "Comfort & Convenience"
}

export enum FieldEnum {
    BOOLEAN = "boolean",
    TEXT = "text",
    NUMBER = "number",
}

@Entity ("feature_and_specifications")
export class FeatureAndSpecification extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        type: "enum",
        enum: TypeEnum,
        nullable: true,
        default: null
    })
    type!: TypeEnum;

    @Column({
        type: "enum",
        enum: CategoryEnum,
        default: null
    })
    category!: CategoryEnum;

    @Column({
        type: "enum",
        enum: FieldEnum,
        default: FieldEnum.BOOLEAN
    })
    field!: FieldEnum;

    @Column()
    name!: string;

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    created_at!: string | any;
    
    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    updated_at!: string | any;

    @OneToMany( () => VariantFeatureAndSpecification, VariantFeatureAndSpecification => VariantFeatureAndSpecification.featureAndSpecification)
    variantFeatureAndSpecification!: Relation<VariantFeatureAndSpecification>[];

}
