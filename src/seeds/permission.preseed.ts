import { Request, Response } from 'express';
import { Manager } from '../app-data-source';
import { Permission } from '../entities/permission.entity'
import { Role } from '../entities/role.entity'
import { Connection } from "typeorm";



export const permissionSeed = async (req: Request, res: Response) => {
    // await Manager.query("SET FOREIGN_KEY_CHECKS = 0; TRUNCATE table permission; TRUNCATE table role; SET FOREIGN_KEY_CHECKS = 1;");
    
    const entities = Manager.connection.entityMetadatas;

    await Manager.query("SET FOREIGN_KEY_CHECKS = 0;");
    for (const entity of entities) {
        await Manager.query(`TRUNCATE TABLE ${entity.tableName}`);
        // await Manager.query(`TRUNCATE TABLE "${entity.tableName}" CASCADE;`);
        // await Manager.query(`ALTER table ${entity.tableName} DISABLE TRIGGER ALL;`);
        // const repository = Manager.getRepository(entity.name);
        // await repository.clear();
        // await Manager.query(`ALTER table ${entity.tableName} ENABLE TRIGGER ALL;`);
    }
    await Manager.query("SET FOREIGN_KEY_CHECKS = 1;");

    // create default permissions
    const permissionRepository = Manager.getRepository(Permission)

    const perms = [
        'view_users',
        'edit_users',
        'view_roles',
        'edit_roles',
        'view_products',
        'edit_products',
        'view_orders',
        'edit_orders'
    ]

    let permissions = []
    
    // insert permissions into Permission table
    for (let i = 0; i< perms.length; i++){
        permissions.push(
            await permissionRepository.save(
                { name: perms[i] }
            )
        )
    }

    // const allPerms = await Manager.getRepository(Permission).find({
    //     select: ["name"]
    // });

    res.status(201).send({
        message: 'default user permissions created',
        perms
    })
}