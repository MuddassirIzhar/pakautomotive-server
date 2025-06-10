import { BaseEntity, Column, Entity, Unique, PrimaryGeneratedColumn, CreateDateColumn, OneToMany, type Relation, ManyToOne, JoinColumn, UpdateDateColumn } from "typeorm";
import { LeadUser } from "./lead-user.entity";
import { User } from "./user.entity";
import { Service } from "./service.entity";

@Entity ("leads")
export class Lead extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    first_name!: string;

    @Column()
    last_name!: string;

    @Column()
    email!: string;

    @Column()
    credits!: number;
    
    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    created_at!: string | any;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    updated_at!: string | any;

    @ManyToOne(() => User)
    @JoinColumn({name: 'user_id'})
    user!: User;

    @ManyToOne(() => Service)
    @JoinColumn({name: 'service_id'})
    service!: Service;

    @OneToMany( () => LeadUser, LeadUser => LeadUser.order)
    lead_users!: Relation<LeadUser>[];

}
