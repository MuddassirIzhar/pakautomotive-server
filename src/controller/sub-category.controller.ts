import { Request, Response } from "express";
import { myDataSource } from '../app-data-source';
import { StatusEnum, SubCategory } from '../entities/sub-category.entity';
import { FindManyOptions, Like } from "typeorm";
import uploadFiles from "../utils/helpers/uploadFiles";
const repository = myDataSource.getRepository(SubCategory);
interface MulterRequest extends Request {
    images: any;
}

export const GetSubCategories = async (req: Request, res: Response) => {

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
                { status: query as StatusEnum },
                { category: 
                    {
                        name : Like(`%${query}%`)
                    }
                }
              ]
            : undefined,
        relations: ['category']
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


export const GetSubCategory = async (req: Request, res: Response) => {
    const id : any = req.params.id;
    const subCategoryData = await repository.findOne({ 
        where: { id: id },
        relations: ['category']
    })

    res.send({ subCategoryData });
}

export const CreateSubCategory = async (req: Request, res: Response) => {
    // check if subCategory exists in db
    const existingSubCategory = await repository.findOneBy(
        {
            name: req.body.name
        }
    )

    // if does not exists break
    if (existingSubCategory) {
        return res.status(409).send({
            message: 'Sub Category name aleady exists!'
        })
    }
    const uploadResult = await uploadFiles(req as MulterRequest);

    if (!uploadResult.status) {
        return res.status(400).json({
            message: uploadResult.message
        });
    }

    let uploadPaths = uploadResult.filePaths;
    const { category, name, ...body } = req.body;
    const slug = name
                .toLowerCase() // Convert to lowercase
                .replace(/\s+/g, '-') // Replace spaces with hyphens
                .replace(/[^a-z0-9-]/g, '') // Remove special characters
                .replace(/-+/g, '-') // Replace multiple hyphens with a single hyphen
                .trim(); // Remove leading/trailing spaces
    const { password, ...subCategory} = await repository.save({
        name,
        slug,
        logo: uploadPaths ? uploadPaths[0] : 'public/company-placeholder.png',
        ...body,
        category: {
            id: category
        }
    })

    // res.status(201).send(subCategory)
    return res.status(201).json({
        message: 'Sub Category Created Successfully!'
    });
}


export const UpdateSubCategory = async (req: Request, res: Response) => {
    // check if subCategory exists in db
    const subCategoryCheck = await repository.findOneBy(
        {
            name: req.body.name
        }
    )
    const id : number = parseInt(req.params.id);

    // if does not exists break
    if (subCategoryCheck && subCategoryCheck.id !== id) {
        return res.status(404).send({
            message: 'ERROR :: Sub Category name already exists!'
        })
    }
    const requestedFiles  = (req as MulterRequest).files;
    let uploadPaths: string[] = [];
    if (requestedFiles && Object.keys(requestedFiles).length > 0) {
        const uploadResult = await uploadFiles(req as MulterRequest);

        if (uploadResult.status) {
            uploadPaths = uploadResult.filePaths || [];
        }
    }
    const { category, name, existingImages, ...body } = req.body;
    const slug = name
                .toLowerCase() // Convert to lowercase
                .replace(/\s+/g, '-') // Replace spaces with hyphens
                .replace(/[^a-z0-9-]/g, '') // Remove special characters
                .replace(/-+/g, '-') // Replace multiple hyphens with a single hyphen
                .trim(); // Remove leading/trailing spaces
    if (!uploadPaths || uploadPaths.length === 0) {
        uploadPaths = existingImages;
    }
    const update = await repository.update(req.params.id, {
        name,
        slug,
        logo: uploadPaths ? uploadPaths[0] : 'public/company-placeholder.png',
        ...body,
        category: {
            id: category
        }
    })
    
    return res.status(202).json({
        message: 'Sub Category Updated Successfully!'
    });
    // const subCategoryData = await repository.findOne({ 
    //     where: { id: id },
    //     relations: ['category']
    // })

    // if (!!subCategoryData) {
    //     const { password, ...subCategory } = subCategoryData;
    //     res.status(202).send(subCategory)
    // }
    // res.status(202).send(update)
}

export const DeleteSubCategory = async (req: Request, res: Response) => {
    const deleteSubCategory = await repository.delete(req.params.id)
    
    return res.status(200).json({
        message: 'Sub Category Deleted Successfully!',
    });
    // res.status(204).send(deleteSubCategory)
    res.status(200).send(deleteSubCategory)
}