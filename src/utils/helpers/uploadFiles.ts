import { Request } from 'express';
import fs from 'fs';
import { extname } from 'path';

interface UploadResult {
    status: boolean;
    message?: string;
    filePaths?: string[];
    fileTypes?: string[];
    fileExtensions?: string[];
    fileMimeTypes?: string[];
}

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

async function uploadFiles(req: MulterRequest): Promise<UploadResult> {
    const requestedFiles = req.files;
    const uploadPaths: string[] = [];
    const fileTypes: string[] = [];
    const fileExtensions: string[] = [];
    const fileMimeTypes: string[] = [];

    if (!requestedFiles || Object.keys(requestedFiles).length === 0) {
        return { status: false, message: 'No files uploaded' };
    }

    const filesArray = Array.isArray(requestedFiles) ? requestedFiles : Object.values(requestedFiles).flat();

    for (const file of filesArray) {
        const fileType = file.mimetype;
        const fileExtension = extname(file.originalname);
        const newFileName = (new Date().getTime()) + Math.random().toString(20).substring(2, 12) + fileExtension;

        let dir: string;
        let fileTypeCategory: string;

        if (PHOTO_COLLECTION.some(v => v.file === fileExtension && v.type === fileType)) {
            dir = 'uploads/photo/';
            fileTypeCategory = 'photo';
        } else if (VIDEO_COLLECTION.some(v => v.file === fileExtension && v.type === fileType)) {
            dir = 'uploads/video/';
            fileTypeCategory = 'video';
        } else {
            return {
                status: false,
                message: 'Only Photos and Videos are allowed',
                fileExtensions: [fileExtension],
                fileMimeTypes: [fileType],
            };
        }

        fileTypes.push(fileTypeCategory);
        fileExtensions.push(fileExtension);
        fileMimeTypes.push(fileType);

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        const uploadPath = dir + newFileName;
        uploadPaths.push(uploadPath);

        try {
            await fs.promises.writeFile(uploadPath, file.buffer);
        } catch (err) {
            return { status: false, message: 'Failed to save file' };
        }
    }

    return {
        status: true,
        filePaths: uploadPaths,
        fileTypes,
        fileExtensions,
        fileMimeTypes,
    };
}

export default uploadFiles;