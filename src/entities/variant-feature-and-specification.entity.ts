import { BaseEntity, Column, Entity, Unique, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, type Relation, ManyToOne, JoinColumn } from "typeorm";
import { Variant } from "./variant.entity";
import { FeatureAndSpecification } from "./feature-and-specification.entity";


@Entity ("variant_feature_and_specifications")
export class VariantFeatureAndSpecification extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    value!: string;

    @ManyToOne(() => Variant)
    @JoinColumn({name: 'variant_id'})
    variant!: Relation<Variant>;

    @ManyToOne(() => FeatureAndSpecification)
    @JoinColumn({name: 'feature_and_specification_id'})
    featureAndSpecification!: Relation<FeatureAndSpecification>;

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    created_at!: string | any;
    
    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    updated_at!: string | any;

}
