import { Request, Response } from 'express';
import { Manager } from '../app-data-source';
import { User } from '../entities/user.entity';
import bcryptjs from "bcryptjs";


export const userAdminSeed = async (req: Request, res: Response) => {
    // await Manager.query("SET FOREIGN_KEY_CHECKS = 0; TRUNCATE table user; SET FOREIGN_KEY_CHECKS = 1;");
    // await Manager.query(`ALTER TABLE "user" DISABLE TRIGGER ALL; TRUNCATE TABLE "user" CASCADE; ALTER TABLE "user" ENABLE TRIGGER ALL;`);
    await Manager.query(`TRUNCATE TABLE "user" CASCADE;`);

    const repository = Manager.getRepository(User);
    const { ...user } = await repository.save({
        firstName: "Admin",
        lastName: "User",
        email: "admin@example.com",
        password: await bcryptjs.hash("12345678", 10),
        role: {
            id: 1
        }
    })
    const userData= await repository.findOne({ 
        where: { id: user.id },
        relations: ['role.permissions']
    })
    if (!!userData) {
        const { password, ...user } = userData;
        res.status(201).send({
            message: 'default admin user created',
            user,
            "credentials":{
                "email":user.email,
                "password":'12345678'
            }
        })
    }

    
}