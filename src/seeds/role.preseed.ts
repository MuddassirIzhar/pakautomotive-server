import { Request, Response } from 'express';
import { Manager } from '../app-data-source';
import { Permission } from '../entities/permission.entity'
import { Role } from '../entities/role.entity'


export const roleSeed = async (req: Request, res: Response) => {
    await Manager.query("SET FOREIGN_KEY_CHECKS = 0; TRUNCATE table role_permissions; SET FOREIGN_KEY_CHECKS = 1;");
    // await Manager.query(`ALTER TABLE "role" DISABLE TRIGGER ALL; TRUNCATE TABLE "role" CASCADE; ALTER TABLE "role" ENABLE TRIGGER ALL;`);
    // await Manager.query(`TRUNCATE TABLE "role" CASCADE;`);

    // create role permissions
    const permissionRepository = Manager.getRepository(Permission)
    const allPerms = await permissionRepository.find();

    // assign permissions to roles
    const roleRepository = Manager.getRepository(Role)
    // admin gets all the permissions
    await roleRepository.save({
        name: 'Admin',
        permissions: allPerms
    })

    // editor is not allowed to edit roles
    delete allPerms[3];

    await roleRepository.save({
        name: 'Editor',
        permissions: allPerms
    })

    // viewer cannot edit at all
    delete allPerms[1];
    delete allPerms[5];
    delete allPerms[7];

    await roleRepository.save({
        name: 'Viewer',
        permissions: allPerms
    })
    
    res.status(201).send({
        message: 'default user roles created'
    })
}