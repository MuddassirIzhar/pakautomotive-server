import { BaseEntity, Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
// import { RolePermissions } from "./role-permission.entity";
import { Role } from "./role.entity";

@Entity ("permissions")
export class Permission extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: any;

    @Column()
    name!: string;

    // @OneToMany(() => RolePermissions, (row) => row.permission_id)
    // @OneToMany(() => RolePermissions, (row) => row.permission_id, {
    //     onDelete: "CASCADE",
    //     cascade: true,
    // })
    // role_permissions!: RolePermissions[]



    // @ManyToMany(() => Role, (role) => role.id
    // // , { onDelete: "CASCADE"}
    // )
    // @JoinTable({
    //     name: 'role_permissions',
    //     joinColumn: {
    //         name: 'role_id',
    //         referencedColumnName: 'id'
    //     },
    //     inverseJoinColumn: {
    //         name: 'permission_id',
    //         referencedColumnName: 'id'
    //     },
    // })
    // roles!: Role[];
    // @ManyToMany(() => Role, (role) => role.id, {
    //     // onDelete: "CASCADE"
    //     cascade: true
    // })
    // @JoinTable({
    //     name: 'role_permissions',
    //     joinColumn: {
    //         name: 'role_id',
    //         referencedColumnName: 'id'
    //     },
    //     inverseJoinColumn: {
    //         name: 'permission_id',
    //         referencedColumnName: 'id'
    //     },
    // })
    // permissions!: Role[];

}