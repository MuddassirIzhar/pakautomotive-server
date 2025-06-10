// import { BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
// import { Permission } from "./permission.entity";
// import { Role } from "./role.entity";

// @Entity ()
// export class RolePermissions extends BaseEntity {

//     @PrimaryGeneratedColumn()
//     id: any;

//     @OneToOne(() => Role)
//     @JoinColumn()
//     role_id!: Role

//     @OneToOne(() => Permission)
//     @JoinColumn()
//     permission_id!: Permission
// }