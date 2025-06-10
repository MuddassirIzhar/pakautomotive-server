import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, type Relation, ManyToOne, JoinColumn } from "typeorm";
import { Variant } from "./variant.entity";



@Entity ("variant_colors")
export class VariantColor extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;
        
    @ManyToOne(() => Variant)
    @JoinColumn({name: 'variant_id'})
    variant!: Relation<Variant>;

    @Column({ nullable: true })
    name!: string;

    @Column({ nullable: true })
    hex!: string;
}
