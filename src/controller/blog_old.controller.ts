import { Request, Response } from "express";
import { myDataSource } from '../app-data-source';
import { BlogStatusEnum, Blog } from '../entities/blog.entity';
import { FindManyOptions, Like } from "typeorm";
import path, { extname, join } from "path";
import fs from 'fs';
import { BlogGallery } from "../entities/blog-gallery.entity";
import { User } from "../entities/user.entity";
const repository = myDataSource.getRepository(Blog);
const galleryRepository = myDataSource.getRepository(BlogGallery);

interface MulterRequest extends Request {
    files: any;
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
                { variant: 
                    {
                        name : Like(`%${query}%`),
                        year : Like(`%${query}%`),
                        model: 
                        {
                            name : Like(`%${query}%`),
                            brand: 
                            {
                                name : Like(`%${query}%`),
                                sub_category: 
                                {
                                    name : Like(`%${query}%`),
                                    category: 
                                    {
                                        name : Like(`%${query}%`)
                                    }
                                }
                            }
                        }
                    }
                }
              ]
            : undefined,
        relations: ['variant.model.brand.sub_category.category']
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
    const id : any = req.params.id;
    const blogData = await repository.findOne({ 
        where: { id: id },
        relations: ['variant.model.brand.sub_category.category']
    })

    res.send({ blogData });
}

export const CreateBlog = async (req: Request, res: Response) => {
    try {
        // Log the request body and files for debugging
        console.log('Form data:', req.body);
        console.log('Uploaded files:', req.files);

        // Check if blog exists in the database
        const existingBlog = await repository.findOneBy({
            title: req.body.title,
        });

        // If the blog already exists, return an error
        if (existingBlog) {
            return res.status(409).send({
                message: 'Blog name already exists!',
            });
        }

        // Initialize variables for file handling
        let uploadPaths: Array<string> = [];
        let fileTypes: Array<string> = [];
        const requestedFiles = (req as MulterRequest).files; // Use .files for multiple files

        // Process each uploaded file
        if (requestedFiles && requestedFiles.length > 0) {
            for (const file of requestedFiles) {

                if (!file || file.path || !file.mimetype || !file.originalname) {
                    console.error('Invalid file object:', file);
                    return res.status(500).json({
                        message: 'Error creating blog'
                    });
                    continue; // Skip invalid files
                }

                const fileType = file.mimetype;
                const fileExtension = extname(file.originalname);
                const newFileName = `${new Date().getTime()}_${Math.random()
                    .toString(20)
                    .substring(2, 12)}${fileExtension}`;

                // Check if the uploaded file is allowed
                let dir;
                let fileTypeCategory;
                if (
                    PHOTO_COLLECTION.some(
                        (v) => v.file === fileExtension && v.type === fileType
                    )
                ) {
                    dir = 'uploads/photo/';
                    fileTypeCategory = 'photo';
                } else if (
                    VIDEO_COLLECTION.some(
                        (v) => v.file === fileExtension && v.type === fileType
                    )
                ) {
                    dir = 'uploads/video/';
                    fileTypeCategory = 'video';
                } else {
                    return res.status(400).send({
                        status: false,
                        message: 'Only Photos and Videos are allowed',
                        fileExtension,
                        fileType,
                    });
                }

                // Create the directory if it doesn't exist
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir, { recursive: true });
                }

                // Move the file to the upload directory
                const uploadPath = path.join(dir, newFileName);
                await fs.promises.rename(file.path, uploadPath);

                // Save the file path and type
                uploadPaths.push(uploadPath);
                fileTypes.push(fileTypeCategory);
            }
        }

        // Extract form data
        const user = req['user'];
        const {
            title,
            content,
            category,
            tags,
            image_url,
            status,
            read_time,
            meta_title,
            meta_keywords,
            meta_description,
            model,
            authorId,
            customSlug,
        } = req.body;

        // Validate author
        let author = user;
        if (authorId) {
            author = await myDataSource.getRepository(User).findOneBy({ id: authorId });
            if (!author) {
                return res.status(404).json({ message: 'Author not found' });
            }
        }

        // Generate a slug if not provided
        const slug = customSlug
            ? customSlug
            : title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

        // Save the blog to the database
        const blog = await repository.save({
            title,
            content,
            author: { id: author.id },
            slug,
            category,
            tags,
            image_url,
            status,
            read_time,
            published_at: new Date(),
            meta_title,
            meta_keywords,
            meta_description,
            model: { id: model },
        });

        // Save the gallery entries for the uploaded files
        for (let i = 0; i < uploadPaths.length; i++) {
            await galleryRepository.save({
                blog: { id: blog.id },
                file: uploadPaths[i],
                file_type: fileTypes[i],
            });
        }

        // Return success response
        return res.status(201).json({
            message: 'Blog Created Successfully!',
            blog,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Error creating blog',
            error
        });
    }
};


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
    const update = await repository.save({
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