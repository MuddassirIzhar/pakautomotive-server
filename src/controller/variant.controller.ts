import { Request, Response } from "express";
import { myDataSource } from '../app-data-source';
import { StatusEnum, Variant } from '../entities/variant.entity';
import { FindManyOptions, Like } from "typeorm";
import { extname } from "path";
import fs from 'fs';
import { VariantColor } from "../entities/variant-colors.entity";
import { VariantFeatureAndSpecification } from "../entities/variant-feature-and-specification.entity";
import { Brand } from "../entities/brand.entity";
const repository = myDataSource.getRepository(Variant);
const colorsRepository = myDataSource.getRepository(VariantColor);
const featureAndSpecificationRepository = myDataSource.getRepository(VariantFeatureAndSpecification);
interface MulterRequest extends Request {
    images: any;
}

let VIDEO_COLLECTION = [
    { file: ".3gp", type: "video/3gpp" },
    { file: ".asf", type: "video/x-ms-asf" },
    { file: ".avi", type: "video/x-msvideo" },
    { file: ".m4u", type: "video/vnd.mpegurl" },
    { file: ".m4v", type: "video/x-m4v" },
    { file: ".mov", type: "video/quicktime" },
    { file: ".mp4", type: "video/mp4" },
    { file: ".mpe", type: "video/mpeg" },
    { file: ".mpeg", type: "video/mpeg" },
    { file: ".mpg", type: "video/mpeg" },
    { file: ".mpg4", type: "video/mp4" },
];

let PHOTO_COLLECTION = [
    { file: ".bmp", type: "image/bmp" },
    { file: ".gif", type: "image/gif" },
    { file: ".jpeg", type: "image/jpeg" },
    { file: ".jpg", type: "image/jpeg" },
    { file: ".png", type: "image/png" },
    { file: ".svg", type: "image/svg+xml" },
];

export const GetVariants = async (req: Request, res: Response) => {

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
                { price: Like(`%${query}%`) },
                { status: query as StatusEnum },
                { brand: 
                    {
                        name : Like(`%${query}%`)
                    }
                },
                { model: 
                    {
                        name : Like(`%${query}%`)
                    }
                }
              ]
            : undefined,
            relations: ['brand.models', 'model', 'colors', 'variantFeatureAndSpecifications.featureAndSpecification'],
            order: {
                id: "ASC",
            }
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
export const GetVariant = async (req: Request, res: Response) => {
    const { identifier } = req.params;
    
    // First get the basic variant without heavy relations
    const baseVariant = await repository.findOne({
        where: isNaN(Number(identifier)) 
            ? { slug: identifier }
            : { id: Number(identifier) },
        relations: ['brand', 'model.variants', 'colors'] // Only immediate relations
    });

    if (!baseVariant) {
        return res.status(404).json({ message: "Variant not found" });
    }

    // Then load complex relations separately
    const [featureSpecs, brandModels] = await Promise.all([
        repository
            .createQueryBuilder('variant')
            .leftJoinAndSelect('variant.variantFeatureAndSpecifications', 'vfas')
            .leftJoinAndSelect('vfas.featureAndSpecification', 'fas')
            .where('variant.id = :variantId', { variantId: baseVariant.id })
            .getOne()
            .then(variant => variant?.variantFeatureAndSpecifications || []),

        repository
            .createQueryBuilder('variant')
            .relation(Brand, 'models')
            .of(baseVariant.brand.id)
            .loadMany()
    ]);

    // Attach the relations to the response
    const response = {
        ...baseVariant,
        variantFeatureAndSpecifications: featureSpecs,
        brand: {
            ...baseVariant.brand,
            models: brandModels
        }
    };

    res.json({ variant: response });
}


export const CreateVariant = async (req: Request, res: Response) => {
    // check if variant exists in db
    const existingVariant = await repository.findOneBy(
        {
            name: req.body.name
        }
    )

    // if does not exists break
    if (existingVariant) {
        return res.status(409).send({
            message: 'Variant name aleady exists!'
        })
    }
    let file_extension: any = null;
    let file_type: any = null;
    let fileType: any = null;
    let uploadPaths: Array<string> = [];
    let fileTypes: Array<string> = [];
    let uploadPath;
    let dir;
    const requestedFiles  = (req as MulterRequest).files;
    if (requestedFiles && Object.keys(requestedFiles).length > 0) {
        // The name of the input field (i.e. "file") is used to retrieve the uploaded file

        const filesArray = Array.isArray(requestedFiles) ? requestedFiles : Object.values(requestedFiles).flat();
        for (const file of filesArray) {
            // if(requestedFiles.file){
            //     file = requestedFiles.file;
                fileType = file.mimetype;
                
                file_extension = extname(file.originalname);
                const newFileName = (new Date().getTime()) + Math.random().toString(20).substring(2, 12) + file_extension;

                // Check if the uploaded file is allowed
                if (PHOTO_COLLECTION.filter(function(v) {return ( v.file == file_extension && v.type == fileType )}).length > 0) {
                    dir = 'uploads/photo/';
                    file_type = 'photo';
                } else if (VIDEO_COLLECTION.filter(function(v) {return ( v.file == file_extension && v.type == fileType )}).length > 0) {
                    dir = 'uploads/video/';
                    file_type = 'video';
                } else {
                    return res.status(400).send({
                        status: false,
                        message: 'Only Photos and Videos are allowed',
                        file_extension,
                        fileType,
                    })
                }
                fileTypes.push(file_type);
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir, { recursive: true });
                }
                uploadPath = dir + newFileName;
                uploadPaths.push(uploadPath);
                // Use the mv() method to place the file somewhere on your server
                fs.writeFile(uploadPath, file.buffer, (err) => {
                    if (err) {
                        return res.status(500).send(err);
                    }
                });
            // }
        }
    }
    const { model, name, brand, colors, featureAndSpecifications, ...body } = req.body;
    const slug = name
                .toLowerCase() // Convert to lowercase
                .replace(/\s+/g, '-') // Replace spaces with hyphens
                .replace(/[^a-z0-9-]/g, '') // Remove special characters
                .replace(/-+/g, '-') // Replace multiple hyphens with a single hyphen
                .trim(); // Remove leading/trailing spaces
    const { password, ...variant} = await repository.save({
        ...body,
        name,
        slug,
        images: uploadPaths,
        brand: {
            id: brand
        },
        model: {
            id: model
        }
    })

    // Save the color entries for the model entry
    colors.forEach(async (color: { name: string; hex : string } ) => {
        await colorsRepository.save({
            variant: { id: variant.id },
            name: color.name,
            hex: color.hex,
        });
    });
    // Save the feature and specification entries for the model entry
    featureAndSpecifications.forEach(async (color: { fas_id: number; value : string } ) => {
        await featureAndSpecificationRepository.save({
            variant: { id: variant.id },
            featureAndSpecification: { id: color.fas_id },
            value: color.value,
        });
    });

    // res.status(201).send(variant)
    return res.status(201).json({
        message: 'Variant Created Successfully!'
    });
}


export const UpdateVariant = async (req: Request, res: Response) => {
    // check if variant exists in db
    const variantCheck = await repository.findOneBy(
        {
            name: req.body.name
        }
    )
    const id : number = parseInt(req.params.id);

    // if does not exists break
    if (variantCheck && variantCheck.id !== id) {
        return res.status(404).send({
            message: 'ERROR :: Variant name already exists!'
        })
    }
    let file_extension: any = null;
    let file_type: any = null;
    let fileType: any = null;
    let uploadPaths: Array<string> = [];
    let fileTypes: Array<string> = [];
    let uploadPath;
    let dir;
    const requestedFiles  = (req as MulterRequest).files;
    if (requestedFiles && Object.keys(requestedFiles).length > 0) {
        // The name of the input field (i.e. "file") is used to retrieve the uploaded file

        const filesArray = Array.isArray(requestedFiles) ? requestedFiles : Object.values(requestedFiles).flat();
        for (const file of filesArray) {
            // if(requestedFiles.file){
            //     file = requestedFiles.file;
                fileType = file.mimetype;
                
                file_extension = extname(file.originalname);
                const newFileName = (new Date().getTime()) + Math.random().toString(20).substring(2, 12) + file_extension;

                // Check if the uploaded file is allowed
                if (PHOTO_COLLECTION.filter(function(v) {return ( v.file == file_extension && v.type == fileType )}).length > 0) {
                    dir = 'uploads/photo/';
                    file_type = 'photo';
                } else if (VIDEO_COLLECTION.filter(function(v) {return ( v.file == file_extension && v.type == fileType )}).length > 0) {
                    dir = 'uploads/video/';
                    file_type = 'video';
                } else {
                    return res.status(400).send({
                        status: false,
                        message: 'Only Photos and Videos are allowed',
                        file_extension,
                        fileType,
                    })
                }
                fileTypes.push(file_type);
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir, { recursive: true });
                }
                uploadPath = dir + newFileName;
                uploadPaths.push(uploadPath);
                // Use the mv() method to place the file somewhere on your server
                fs.writeFile(uploadPath, file.buffer, (err) => {
                    if (err) {
                        return res.status(500).send(err);
                    }
                });
            // }
        }
    }
    let { model, name, existingImages, brand, colors, featureAndSpecifications, ...body } = req.body;
    const slug = name
                .toLowerCase() // Convert to lowercase
                .replace(/\s+/g, '-') // Replace spaces with hyphens
                .replace(/[^a-z0-9-]/g, '') // Remove special characters
                .replace(/-+/g, '-') // Replace multiple hyphens with a single hyphen
                .trim(); // Remove leading/trailing spaces
    if(existingImages == undefined){
        existingImages = [];
    }
    const combinedImages = [...existingImages, ...uploadPaths];
    const update = await repository.update(id, {
        ...body,
        name,
        slug,
        images:combinedImages,
        brand: {
            id: brand
        },
        model: {
            id: model
        }
    })

    await colorsRepository.delete({ variant: { id: id } });
    // Save the colr entries for the variant entry
    for (const color of colors) {
      await colorsRepository.save({
        variant: { id: id },
        name: color.name,
        hex: color.hex,
      });
    }

    await featureAndSpecificationRepository.delete({ variant: { id: id } });
    // Save the feature and specification entries for the model entry
    featureAndSpecifications.forEach(async (color: { fas_id: number; value : string } ) => {
        await featureAndSpecificationRepository.save({
            variant: { id: id },
            featureAndSpecification: { id: color.fas_id },
            value: color.value,
        });
    });
    
    return res.status(202).json({
        message: 'Variant Updated Successfully!'
    });
    // const variantData = await repository.findOne({ 
    //     where: { id: id },
    //     relations: ['model']
    // })

    // if (!!variantData) {
    //     const { password, ...variant } = variantData;
    //     res.status(202).send(variant)
    // }
    // res.status(202).send(update)
}

export const DeleteVariant = async (req: Request, res: Response) => {
    const id = req.params.id;
    
    // First delete associated colors
    await colorsRepository.delete({ variant: { id: Number(id) } });
    
    // Then delete associated feature specifications
    await featureAndSpecificationRepository.delete({ variant: { id: Number(id) } });
    
    // Finally delete the variant
    await repository.delete(id);
    
    return res.status(200).json({
        message: 'Variant Deleted Successfully!',
    });
}