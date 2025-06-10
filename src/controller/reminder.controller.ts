import { Request, Response } from "express";
import { myDataSource } from '../app-data-source';
import bcryptjs from "bcryptjs";
import { Not } from "typeorm";
import { Reminder } from "../entities/reminder.entity";
import { userAdminSeed } from "../seeds/userAdmin.preseed";
const repository = myDataSource.getRepository(Reminder);

export const GetReminders = async (req: Request, res: Response) => {
    // pagination
    // only retrieve 15 items per page
    const take = 15
    const page = parseInt(req.query.page as string || '1')
    // find 'take' number of items starting from zero or (page-1)*take
    const [data, total] = await repository.findAndCount({
        take: take,
        skip: ( page - 1 ) * take,
    })

    res.send({
        data,
        // also return active page, last page and total number of items
        meta: {
            total,
            page,
            last_page: Math.ceil(total / take)
        }
    })
}


export const GetMyReminders = async (req: Request, res: Response) => {
    const user = req['user'];
    // pagination
    // only retrieve 15 items per page
    const take = 15
    const page = parseInt(req.query.page as string || '1')
    // find 'take' number of items starting from zero or (page-1)*take
    const [data, total] = await repository.findAndCount({
        where: {
            creator: user.id,
        },
        take: take,
        skip: ( page - 1 ) * take,
        relations: ['patient','creator']
    })

    res.send({
        data,
        // also return active page, last page and total number of items
        meta: {
            total,
            page,
            last_page: Math.ceil(total / take)
        }
    })
}

export const GetReminder = async (req: Request, res: Response) => {
    const id : any = req.params.id;
    const reminder = await repository.findOne({ 
        where: { id: id },
        relations: ['patient','creator']
    })
    res.send({ reminder })
}

export const CreateReminder = async (req: Request, res: Response) => {
    const user = req['user'];
    const { patient_id, ...body } = req.body;
    const reminder = await repository.save(
        {
            ...body,
            patient: {
                id: patient_id
            },
            creator: {
                id: user.id
            }
        }
    )
    res.status(201).send(reminder)
}


export const UpdateReminder = async (req: Request, res: Response) => {
    const user = req['user'];
    const id : any = req.params.id;
    const { patient_id, ...body } = req.body;
    const update = await repository.update(req.params.id, {
        ...body,
        patient: {
            id: patient_id
        },
        creator: {
            id: user.id
        }
    })
    
    const reminder = await repository.findOne({ 
        where: { id: id },
        relations: ['patient','creator']
    })
    res.send({ reminder })
}

export const DeleteReminder = async (req: Request, res: Response) => {
    const deleteReminder = await repository.delete(req.params.id)
    
    res.status(200).send(deleteReminder)
}