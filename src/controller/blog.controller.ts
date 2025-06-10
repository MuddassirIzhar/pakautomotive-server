import { Request, Response } from "express";
import { myDataSource } from '../app-data-source';
import { BlogStatusEnum, Blog } from '../entities/blog.entity';
import { FindManyOptions, Like } from "typeorm";
import { extname } from "path";
import fs from 'fs';
import { BlogGallery } from "../entities/blog-gallery.entity";
import { User } from "../entities/user.entity";
import { BlogPros } from "../entities/blog-pros.entity";
import { BlogCons } from "../entities/blog-cons.entity";
const repository = myDataSource.getRepository(Blog);
const galleryRepository = myDataSource.getRepository(BlogGallery);
const prosRepository = myDataSource.getRepository(BlogPros);
const consRepository = myDataSource.getRepository(BlogCons);

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

export const GetBlogs = async (req: Request, res: Response) => {

    // pagination
    // only retrieve 15 items per page
    const pageSize = parseInt(req.query.pageSize as string) || undefined;
    const page = parseInt(req.query.page as string) || undefined;
    const sort = parseInt(req.query.sort as string) || undefined;
    const query = req.query.query as string || ''
    const options: FindManyOptions = {
        where: query
            ? [
                { title: Like(`%${query}%`) },
                { status: query as BlogStatusEnum },
                { 
                    model: 
                    {
                        name : Like(`%${query}%`),
                        brand: 
                        {
                            name : Like(`%${query}%`),
                            categories: 
                            {
                                name : Like(`%${query}%`),
                                sub_categories: 
                                {
                                    name : Like(`%${query}%`)
                                }
                            }
                        }
                    }
                }
              ]
            : undefined,
        relations: ['model.brand.categories.sub_categories', 'images', 'pros', 'cons', 'model.variants']
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


export const GetBlog = async (req: Request, res: Response) => {
    const { identifier } = req.params;
    let blog;
    if (!isNaN(Number(identifier))) {
        // If it's a number, assume it's an ID
        blog = await repository.findOne({ 
            where: { id: Number(identifier) },
            relations: ['model.brand.categories.sub_categories', 'images', 'pros', 'cons', 'model.variants']
        });
    } else {
        // Otherwise, assume it's a slug
        blog = await repository.findOne({ 
            where: { slug: identifier },
            relations: ['model.brand.categories.sub_categories', 'images', 'pros', 'cons', 'model.variants']
        });
    }

    if (!blog) {
        return res.status(404).json({ message: "Blog not found" });
    }

    res.json({ blog });
}

export const CreateBlog = async (req: Request, res: Response) => {
    try {
        // check if blog exists in db
        const existingBlog = await repository.findOneBy(
            {
                title: req.body.title
            }
        )

        // if does not exists break
        if (existingBlog) {
            return res.status(409).send({
                message: 'Blog name aleady exists!'
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
        const user = req['user'];
        const { title, content, tags, pros, cons, image_url, status, read_time, meta_title, meta_keywords, meta_description, model, ...body } = req.body;
        let tagsArray: string[] = [];

        tags.forEach((tag: { value: string }) => {
            tagsArray.push(tag.value);
        });
        let { authorId, customSlug } = req.body;
        if(authorId){
            const author = await myDataSource.getRepository(User).findOneBy({ id: authorId });
            if (!author) {
                return res.status(404).json({ message: "Author not found" });
            }
        } else {
            authorId = user.id;
        }
        if (!customSlug){
            // customSlug = title.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
            customSlug = title
                        .toLowerCase() // Convert to lowercase
                        .replace(/\s+/g, '-') // Replace spaces with hyphens
                        .replace(/[^a-z0-9-]/g, '') // Remove special characters
                        .replace(/-+/g, '-') // Replace multiple hyphens with a single hyphen
                        .trim(); // Remove leading/trailing spaces
        }

        const blog = await repository.save({
            title, 
            // mileage_from, 
            // mileage_to, 
            // cc_from,
            // cc_to,
            content,
            author:{
                id:authorId
            },
            slug:customSlug,
            tags:tagsArray,
            image_url,
            // transmission,
            // fuel_type,
            status,
            read_time,
            published_at: new Date(),
            meta_title,
            meta_keywords,
            meta_description,
            model: {
                id: model
            }
        })

        // Save the gallery entries for the uploaded files
        for (let i = 0; i < uploadPaths.length; i++) {
            await galleryRepository.save({
                blog: { id: blog.id },
                file: uploadPaths[i],
                file_type: fileTypes[i],
            });
        }
        
        // Save the pro entries for the blog entry
        pros.forEach(async (pro: { value: string } ) => {
            await prosRepository.save({
                blog: { id: blog.id },
                value: pro.value,
            });
        });

        // Save the con entries for the blog entry
        cons.forEach(async (con: { value: string } ) => {
            await consRepository.save({
                blog: { id: blog.id },
                value: con.value,
            });
        });

        // res.status(201).send(blog)
        return res.status(201).json({
            message: 'Blog Created Successfully!'
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Error creating blog',
            error
        });
    }
}


export const UpdateBlog = async (req: Request, res: Response) => {
    // check if blog exists in db
    const blogCheck = await repository.findOneBy(
        {
            title: req.body.title
        }
    )
    const id : number = parseInt(req.params.id);

    // if does not exists break
    if (blogCheck && blogCheck.id !== id) {
        return res.status(404).send({
            message: 'ERROR :: Blog name already exists!'
        })
    }
    const { categories, ...body } = req.body;
    await repository.update(id, {
        ...body,
        categories: categories.map( (id : any) => {
            return {
                id: id
            }
        })
    })
    
    return res.status(202).json({
        message: 'Blog Updated Successfully!'
    });
}

export const DeleteBlog = async (req: Request, res: Response) => {
    const deleteBlog = await repository.delete(req.params.id)
    
    return res.status(200).json({
        message: 'Blog Deleted Successfully!',
    });
    // res.status(204).send(deleteBlog)
    res.status(200).send(deleteBlog)
}