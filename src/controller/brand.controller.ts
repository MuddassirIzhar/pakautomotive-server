import { Request, Response } from "express";
import { myDataSource } from '../app-data-source';
import { StatusEnum, Brand } from '../entities/brand.entity';
import bcryptjs from "bcryptjs";
import { FindManyOptions, Like } from "typeorm";
import uploadFiles from "../utils/helpers/uploadFiles";
const repository = myDataSource.getRepository(Brand);
interface MulterRequest extends Request {
    images: any;
}

export const GetBrands = async (req: Request, res: Response) => {

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
                { categories: 
                    {
                        name : Like(`%${query}%`)
                    }
                },
              ]
            : undefined,
        relations: ['categories.sub_categories','models.sub_category'] ,
        // relations: pageSize !== undefined ? ['categories.sub_categories','models'] : undefined,
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


export const GetBrand = async (req: Request, res: Response) => {
    const { identifier } = req.params;
    let brand;
    if (!isNaN(Number(identifier))) {
        // If it's a number, assume it's an ID
        brand = await repository.findOne({ 
            where: { id: Number(identifier) },
            relations: ['categories.sub_categories','models.variants','models.sub_category']
        });
    } else {
        // Otherwise, assume it's a slug
        brand = await repository.findOne({ 
            where: { slug: identifier },
            relations: ['categories.sub_categories','models.variants','models.sub_category']
        });
    }

    if (!brand) {
        return res.status(404).json({ message: "Brand not found" });
    }

    res.json({ brand });
}

export const CreateBrand = async (req: Request, res: Response) => {
    // check if brand exists in db
    const existingBrand = await repository.findOneBy(
        {
            name: req.body.name
        }
    )

    // if does not exists break
    if (existingBrand) {
        return res.status(409).send({
            message: 'Brand name aleady exists!'
        })
    }

    const uploadResult = await uploadFiles(req as MulterRequest);

    if (!uploadResult.status) {
        return res.status(400).json({
            message: uploadResult.message
        });
    }

    let uploadPaths = uploadResult.filePaths;
    const { categories, name, ...body } = req.body;
    const slug = name
                .toLowerCase() // Convert to lowercase
                .replace(/\s+/g, '-') // Replace spaces with hyphens
                .replace(/[^a-z0-9-]/g, '') // Remove special characters
                .replace(/-+/g, '-') // Replace multiple hyphens with a single hyphen
                .trim(); // Remove leading/trailing spaces
    const brand = await repository.save({
        name,
        slug,
        logo: uploadPaths ? uploadPaths[0] : 'public/company-placeholder.png',
        ...body,
        categories: categories.map( (category_id : any) => {
            return {
                id: category_id
            }
        })
    })

    // res.status(201).send(brand)
    return res.status(201).json({
        message: 'Brand Created Successfully!'
    });
}


export const UpdateBrand = async (req: Request, res: Response) => {
    // check if brand exists in db
    const brandCheck = await repository.findOneBy(
        {
            name: req.body.name
        }
    )
    const id : number = parseInt(req.params.id);

    // if does not exists break
    if (brandCheck && brandCheck.id !== id) {
        return res.status(409).send({
            message: 'ERROR :: Brand name already exists!'
        })
    }

    // Fetch the existing entity with its relationships
    const brand = await repository.findOne({
        where: { id }, // Assuming `id` is the primary key
        relations: ['categories'], // Include the `categories` relationship
    });
    if (brand === null) {
        return res.status(404).send({
            message: 'ERROR :: Brand not found!'
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
    const { categories, existingImages, name, ...body } = req.body;
    const slug = name
                .toLowerCase() // Convert to lowercase
                .replace(/\s+/g, '-') // Replace spaces with hyphens
                .replace(/[^a-z0-9-]/g, '') // Remove special characters
                .replace(/-+/g, '-') // Replace multiple hyphens with a single hyphen
                .trim(); // Remove leading/trailing spaces

    if (!uploadPaths || uploadPaths.length === 0) {
        uploadPaths = existingImages;
    }
    brand.name = name;
    brand.slug = slug;
    brand.logo = uploadPaths ? uploadPaths[0] : "public/company-placeholder.png";
    Object.assign(brand, body);

    // Update categories (assuming `categories` is an array of IDs)
    if (categories && categories.length > 0) {
        const existingCategoryIds = brand.categories.map((category) => category.id);
        const newCategories = categories
            .filter((categoryId: any) => !existingCategoryIds.includes(categoryId)) // Only add new ones
            .map((categoryId: any) => (parseInt(categoryId)));

        brand.categories= newCategories.map( (category_id : any) => {
            return {
                id: category_id
            }
        })
    }
    
    await repository.save(brand);
    
    return res.status(202).json({
        brand,
        message: 'Brand Updated Successfully!'
    });
}

export const DeleteBrand = async (req: Request, res: Response) => {
    await repository.delete(req.params.id)
    return res.status(200).json({
        message: 'Brand Deleted Successfully!',
    });
}