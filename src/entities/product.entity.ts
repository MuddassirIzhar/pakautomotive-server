import { BaseEntity, Column, Entity, Unique, PrimaryGeneratedColumn } from "typeorm";

@Entity ("products")
// @Unique('constraint_name', ['title'])
export class Product extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    title!: string;

    @Column()
    description!: string;

    @Column()
    image!: string;

    @Column()
    price!: number;
}