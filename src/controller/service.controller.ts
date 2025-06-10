import { Request, Response } from "express";
import { myDataSource } from '../app-data-source';
import { Service } from '../entities/service.entity';
import bcryptjs from "bcryptjs";
import { Not } from "typeorm";
const repository = myDataSource.getRepository(Service);

export const GetServices = async (req: Request, res: Response) => {
    // pagination
    // only retrieve 15 items per page
    const take = parseInt(req.query.take as string || '15')
    const page = parseInt(req.query.page as string || '1')
    // find 'take' number of items starting from zero or (page-1)*take
    const [data, total] = await repository.findAndCount({
        take: take,
        skip: ( page - 1 ) * take
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


export const GetService = async (req: Request, res: Response) => {
    const id : any = req.params.id;
    const serviceData = await repository.findOne({ 
        where: { id: id }
    })

    res.send({ serviceData });
}

export const CreateService = async (req: Request, res: Response) => {
    // check if service exists in db
    const existingService = await repository.findOneBy(
        {
            name: req.body.name
        }
    )

    // if does not exists break
    if (existingService) {
        return res.status(409).send({
            message: 'Service aleady exists!'
        })
    }
    const {...body} = req.body;
    const service = await repository.save({
        ...body
    })

    // res.status(201).send(service)
    return res.status(201).json({
        message: 'Service Created Successfully!'
    });
}


export const UpdateService = async (req: Request, res: Response) => {
    // check if service exists in db
    const serviceCheck = await repository.findOneBy(
        {
            name: req.body.name
        }
    )
    const id : number = parseInt(req.params.id);

    // if does not exists break
    if (serviceCheck && serviceCheck.id !== id) {
        return res.status(404).send({
            message: 'ERROR :: Service already exists!'
        })
    }
    const { ...body } = req.body;
    const update = await repository.update(req.params.id, {
        ...body
    })
    
    return res.status(202).json({
        message: 'Service Updated Successfully!'
    });
}

export const DeleteService = async (req: Request, res: Response) => {
    await repository.delete(req.params.id)
    
    return res.status(200).json({
        message: 'Service Deleted Successfully!'
    });
}