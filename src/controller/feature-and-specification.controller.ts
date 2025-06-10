import { Request, Response } from "express";
import { myDataSource } from '../app-data-source';
import { CategoryEnum, FeatureAndSpecification, TypeEnum } from '../entities/feature-and-specification.entity';
import { FindManyOptions, Like } from "typeorm";
const repository = myDataSource.getRepository(FeatureAndSpecification);

export const FeatureAndSpecifications = async (req: Request, res: Response) => {

    // pagination
    // only retrieve 15 items per page
    const pageSize = parseInt(req.query.pageSize as string) || undefined;
    const page = parseInt(req.query.page as string) || undefined;
    const sort = parseInt(req.query.sort as string) || undefined;
    const query = req.query.query as string || ''
    const options: FindManyOptions = {
        where: query
            ? [
                { name: Like(`%${query}%`) },
                { type: query as TypeEnum },
                { category: query as CategoryEnum },
              ]
            : undefined,
        // relations: ['variantFeatureAndSpecification'] ,
    };
    
    // Conditionally add pagination parameters
    if (pageSize !== undefined && pageSize !== 0 && page !== undefined) {
        options.take = pageSize;
        options.skip = (page - 1) * pageSize;
    }
    
    const [data, total] = await repository.findAndCount(options);
    // Get the total count of all rows in the table (ignoring filters)
    const totalRecords = await repository.count();
    
    const meta = (pageSize !== undefined && pageSize !== 0 && page !== undefined) ? {
        total,
        page,
        last_page: Math.ceil(total / pageSize),
        totalRecords
    } : undefined;
    res.send({
        data,
        // also return active page, last page and total number of items
        meta
    })
}