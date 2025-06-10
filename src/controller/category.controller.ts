import { Request, Response } from "express";
import { myDataSource } from '../app-data-source';
import { StatusEnum, Category } from '../entities/category.entity';
import { FindManyOptions, Like } from "typeorm";
const repository = myDataSource.getRepository(Category);

export const GetCategories = async (req: Request, res: Response) => {
    // pagination
    // only retrieve 15 items per page
    const take = parseInt(req.query.take as string) || undefined;
    const page = parseInt(req.query.page as string) || undefined;
    const sort = parseInt(req.query.sort as string) || undefined;
    const query = req.query.query as string || ''
    const options: FindManyOptions = {
        where: query
            ? [
                  { name: Like(`%${query}%`) },
                  { status: query as StatusEnum }
              ]
            : undefined,
        relations: ['sub_categories']
    };
    
    // Conditionally add pagination parameters
    if (take !== undefined && page !== undefined) {
        options.take = take;
        options.skip = (page - 1) * take;
    }
    
    const [data, total] = await repository.findAndCount(options);
    const meta = (take !== undefined && page !== undefined) ? {
        total,
        page,
        last_page: Math.ceil(total / take)
    } : undefined;
    res.send({
        data,
        // also return active page, last page and total number of items
        meta
    })
}


export const GetCategory = async (req: Request, res: Response) => {
    const id : any = req.params.id;
    const categoryData = await repository.findOne({ 
        where: { id: id },
        relations: ['sub_categories']
    })

    res.send({ categoryData });
}

export const CreateCategory = async (req: Request, res: Response) => {
    // check if category exists in db
    const existingCategory = await repository.findOneBy(
        {
            name: req.body.name
        }
    )

    // if does not exists break
    if (existingCategory) {
        return res.status(409).send({
            message: 'Category aleady exists!'
        })
    }
    const {...body} = req.body;
    const category = await repository.save({
        ...body
    })

    // res.status(201).send(category)
    return res.status(201).json({
        message: 'Category Created Successfully!'
    });
}


export const UpdateCategory = async (req: Request, res: Response) => {
    // check if category exists in db
    const categoryCheck = await repository.findOneBy(
        {
            name: req.body.name
        }
    )
    const id : number = parseInt(req.params.id);

    // if does not exists break
    if (categoryCheck && categoryCheck.id !== id) {
        return res.status(404).send({
            message: 'ERROR :: Category already exists!'
        })
    }
    const { ...body } = req.body;
    const update = await repository.update(req.params.id, {
        ...body
    })
    
    return res.status(202).json({
        message: 'Category Updated Successfully!'
    });
}

export const DeleteCategory = async (req: Request, res: Response) => {
    await repository.delete(req.params.id)
    
    return res.status(200).json({
        message: 'Category Deleted Successfully!'
    });
}