import { Request, Response } from "express";
import { myDataSource } from '../app-data-source';
import { User } from '../entities/user.entity';
import bcryptjs from "bcryptjs";
import { Product } from "../entities/product.entity";

const repository = myDataSource.getRepository(Product);

export const GetProducts = async (req: Request, res: Response) => {
    // pagination
    // only retrieve 15 items per page
    const take = 15
    const page = parseInt(req.query.page as string || '1')
    // find 'take' number of items starting from zero or (page-1)*take
    const [data, total] = await repository.findAndCount({
        take: take,
        skip: ( page - 1 ) * take
    })

    res.send({
        data: data,
        // also return active page, last page and total number of items
        meta: {
            total,
            page,
            last_page: Math.ceil(total / take)
        }
    })
}


export const CreateProduct = async (req: Request, res: Response) => {
    const product = await repository.save(req.body)

    res.status(201).send(product)
}


export const GetProduct = async (req: Request, res: Response) => {
    res.send(await repository.findOne({
        where: { id: parseInt(req.params.id) }
    })
)}

export const UpdateProduct = async (req: Request, res: Response) => {
    await repository.update(parseInt(req.params.id), req.body);
    
    res.status(202).send(await repository.findOne({
        where: { id: parseInt(req.params.id) }
    }))
}


export const DeleteProduct = async (req: Request, res: Response) => {
    const deleteProduct = await repository.delete(req.params.id)
    
    res.status(204).send(deleteProduct)
}