import { BaseEntity, Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Permission } from "./permission.entity";
// import { RolePermissions } from "./role-permission.entity";

@Entity ("roles")
export class Role extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: any;

    @Column()
    name!: string;

    // @ManyToMany(() => Permission)
    @ManyToMany(() => Permission, (permission) => permission.id, {onDelete:"CASCADE"}
    )
    @JoinTable({
        name: 'role_permissions',
        joinColumn: {
            name: 'role_id',
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'permission_id',
            referencedColumnName: 'id'
        },
    })
    permissions!: Permission[];

    // @OneToMany(() => RolePermissions, (row) => row.role_id, {
    //     onDelete: "CASCADE",
    //     cascade: true,
    // })
    // role_permissions!: RolePermissions[]

}