import { Request, Response } from "express";
import { myDataSource } from '../app-data-source';
import { Model, StatusEnum } from "../entities/model.entity";
import { ModelPros } from "../entities/model-pros.entity";
import { ModelCons } from "../entities/model-cons.entity";
import { FindManyOptions, Like } from "typeorm";
import { extname } from "path";
import fs from 'fs';
const repository = myDataSource.getRepository(Model);
const prosRepository = myDataSource.getRepository(ModelPros);
const consRepository = myDataSource.getRepository(ModelCons);
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

export const GetModels = async (req: Request, res: Response) => {

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
                    { brand: 
                        {
                            name : Like(`%${query}%`)
                        }
                    },
                    { sub_category: 
                        {
                            name : Like(`%${query}%`)
                        }
                    }
                  ]
                : undefined,
                // relations: ['brand.categories.sub_categories', 'sub_category']
                relations: pageSize !== undefined ? ['brand.categories.sub_categories', 'sub_category', 'pros', 'cons'] : undefined,
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
    // find 'take' number of items starting from zero or (page-1)*take
    // const [data, total] = await repository.findAndCount({
    //     where: query
    //         ? [
    //                 { name: Like(`%${query}%`) },
    //                 { status: query as StatusEnum },
    //                 { brand: 
    //                     {
    //                         name : Like(`%${query}%`)
    //                     }
    //                 },
    //                 { sub_category: 
    //                     {
    //                         name : Like(`%${query}%`)
    //                     }
    //                 }
    //             ]
    //         : undefined,
    //     take: take,
    //     skip: ( page - 1 ) * take,
    //     relations: ['brand.categories.sub_categories','sub_category']
    // });

    // res.send({
    //     query,
    //     data,
    //     // also return active page, last page and total number of items
    //     meta: {
    //         total,
    //         page,
    //         last_page: Math.ceil(total / take)
    //     }
    // })
}


export const GetModel = async (req: Request, res: Response) => {
    const { identifier } = req.params;
    let model;
    if (!isNaN(Number(identifier))) {
        // If it's a number, assume it's an ID
        model = await repository.findOne({ 
            where: { id: Number(identifier) },
            relations: ['brand.categories.sub_categories', 'sub_category', 'pros', 'cons', 'variants']
        });
    } else {
        // Otherwise, assume it's a slug
        model = await repository.findOne({ 
            where: { slug: identifier },
            relations: ['brand.categories.sub_categories', 'sub_category', 'pros', 'cons', 'variants']
        });
    }

    if (!model) {
        return res.status(404).json({ message: "Model not found" });
    }

    res.json({ model });
    // const id : any = req.params.id;
    // const modelData = await repository.findOne({ 
    //     where: { id: id },
    //     relations: ['brand','sub_category']
    // })

    // res.send({ modelData });
}

export const CreateModel = async (req: Request, res: Response) => {
    // check if model exists in db
    const existingModel = await repository.findOneBy(
        {
            name: req.body.name
        }
    )

    // if does not exists break
    if (existingModel) {
        return res.status(409).send({
            message: 'Model name aleady exists!'
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
    const { brand, name, pros, cons, sub_category, ...body } = req.body;
    const slug = name
                .toLowerCase() // Convert to lowercase
                .replace(/\s+/g, '-') // Replace spaces with hyphens
                .replace(/[^a-z0-9-]/g, '') // Remove special characters
                .replace(/-+/g, '-') // Replace multiple hyphens with a single hyphen
                .trim(); // Remove leading/trailing spaces
    const model = await repository.save({
        ...body,
        name,
        slug,
        images: uploadPaths,
        brand: {
            id: brand
        },
        sub_category: {
            id: sub_category
        }
    })

    // Save the pro entries for the model entry
    pros.forEach(async (pro: { value: string } ) => {
        await prosRepository.save({
            model: { id: model.id },
            value: pro.value,
        });
    });

    // Save the con entries for the model entry
    cons.forEach(async (con: { value: string } ) => {
        await consRepository.save({
            model: { id: model.id },
            value: con.value,
        });
    });

    // res.status(201).send(model)
    return res.status(201).json({
        message: 'Model Created Successfully!'
    });
}


export const UpdateModel = async (req: Request, res: Response) => {
    // check if model exists in db
    const modelCheck = await repository.findOneBy(
        {
            name: req.body.name
        }
    )
    const id : number = parseInt(req.params.id);

    // if does not exists break
    if (modelCheck && modelCheck.id !== id) {
        return res.status(409).send({
            message: 'ERROR :: Model name already exists!'
        })
    }
    // Fetch the existing entity with its relationships
    const model = await repository.findOne({
        where: { id }, // Assuming `id` is the primary key
    });
    if (model === null) {
        return res.status(404).send({
            message: 'ERROR :: Model name already exists!'
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
    let { brand, name, pros, cons, existingImages, sub_category, ...body } = req.body;
    const slug = name
                .toLowerCase() // Convert to lowercase
                .replace(/\s+/g, '-') // Replace spaces with hyphens
                .replace(/[^a-z0-9-]/g, '') // Remove special characters
                .replace(/-+/g, '-') // Replace multiple hyphens with a single hyphen
                .trim(); // Remove leading/trailing spaces
    // let { existingImages } = req.body;
    if(existingImages == undefined){
        existingImages = [];
    }
    const combinedImages = [...existingImages, ...uploadPaths];
    await repository.update(model.id, {
        ...body,
        name,
        slug,
        images:combinedImages,
        brand: {
            id: brand
        },
        sub_category: {
            id: sub_category
        }
    })
    // Delete existing pros and cons
    await prosRepository.delete({ model: { id: model.id } });
    await consRepository.delete({ model: { id: model.id } });
    
    // Save the pro entries for the model entry
    for (const pro of pros) {
      await prosRepository.save({
        model: { id: model.id },
        value: pro.value,
      });
    }
    
    // Save the con entries for the model entry
    for (const con of cons) {
      await consRepository.save({
        model: { id: model.id },
        value: con.value,
      });
    }
    
    return res.status(202).json({
        message: 'Model Updated Successfully!'
    });
    // const modelData = await repository.findOne({ 
    //     where: { id: id },
    //     relations: ['brand']
    // })

    // if (!!modelData) {
    //     const { password, ...model } = modelData;
    //     res.status(202).send(model)
    // }
    // res.status(202).send(update)
}

export const DeleteModel = async (req: Request, res: Response) => {
    const deleteModel = await repository.delete(req.params.id)
    
    return res.status(200).json({
        message: 'Model Deleted Successfully!',
    });
    // res.status(204).send(deleteModel)
    res.status(200).send(deleteModel)
}