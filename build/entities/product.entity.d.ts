import { BaseEntity } from "typeorm";
export declare class Product extends BaseEntity {
    id: number;
    title: string;
    description: string;
    image: string;
    price: number;
}
