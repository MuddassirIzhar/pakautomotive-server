import { Request, Response } from "express";
import { extname } from "path";
import fs from 'fs';
import { myDataSource } from '../app-data-source';
import { PatientCareTeam } from "../entities/patient-care-team.entity";
import { PatientMedicalRecords } from "../entities/patient-medical-records.entity";
import { Patient } from "../entities/patient.entity";
const repository = myDataSource.getRepository(Patient);
const repositoryPatientCareTeam = myDataSource.getRepository(PatientCareTeam);
const repositoryPatientMedicalRecords = myDataSource.getRepository(PatientMedicalRecords);
interface MulterRequest extends Request {
    files: any;
}

let PHOTO_COLLECTION = [
    { file: ".bmp", type: "image/bmp" },
    { file: ".gif", type: "image/gif" },
    { file: ".jpeg", type: "image/jpeg" },
    { file: ".jpg", type: "image/jpeg" },
    { file: ".png", type: "image/png" },
    { file: ".svg", type: "image/svg+xml" },
];

let FILE_COLLECTION = [
    { file: ".csv", type: "text/csv" },
    { file: ".doc", type: "application/msword" },
    { file: ".docx", type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" },
    { file: ".pdf", type: "application/pdf" },
    { file: ".ppt", type: "application/vnd.ms-powerpoint" },
    { file: ".pptx", type: "application/vnd.openxmlformats-officedocument.presentationml.presentation" },
    { file: ".txt", type: "text/plain" },
    { file: ".xls", type: "application/vnd.ms-excel" },
    { file: ".xlsx", type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" },
];
export const GetPatients = async (req: Request, res: Response) => {
    // pagination
    // only retrieve 15 items per page
    const take = 15
    const page = parseInt(req.query.page as string || '1')
    // find 'take' number of items starting from zero or (page-1)*take
    const [data, total] = await repository.findAndCount({
        take: take,
        skip: ( page - 1 ) * take,
        relations:{
            creator:true,
            care_team:true,
            medical_records:true
        }
    })

    res.send({
        data,
        // also return active page, last page and total number of items
        meta: {
            total,
            page,
            last_page: Math.ceil(total / take)
        }
    })
}


export const GetMyPatients = async (req: Request, res: Response) => {
    const user = req['user'];
    // pagination
    // only retrieve 15 items per page
    const take = 15
    const page = parseInt(req.query.page as string || '1')
    // find 'take' number of items starting from zero or (page-1)*take
    const [data, total] = await repository.findAndCount({
        where: {
            creator: user.id,
        },
        take: take,
        skip: ( page - 1 ) * take,
        relations:{
            creator:true,
            care_team:true,
            medical_records:true
        }
    })

    res.send({
        data,
        // also return active page, last page and total number of items
        meta: {
            total,
            page,
            last_page: Math.ceil(total / take)
        }
    })
}

export const GetPatient = async (req: Request, res: Response) => {
    const id : any = req.params.id;
    const patient = await repository.findOne({ 
        where: { id: id },
        relations:{
            creator:true,
            care_team:true,
            medical_records:true
        }
    })
    res.send({ patient })
}

export const CreatePatient = async (req: Request, res: Response) => {
    const user = req['user'];
    const { patient_id, ...body } = req.body;
    const patient = await repository.save(
        {
            ...body,
            creator: {
                id: user.id
            }
        }
    )
    const careTeam = JSON.parse(req.body.careTeam);
    careTeam.forEach(async (data : any,keyObj : any) => {
        const patientCareTeam = await repositoryPatientCareTeam.save(
            {
                user: {
                    id: data.value
                },
                patient: {
                    id: patient.id
                }
            }
        )
    });
    
    let file_extension: any = null;
    let file;
    let file_type: any = null;
    let fileType: any = null;
    let uploadPath;
    let dir;
    const requestedFiles  = (req as MulterRequest).files;
    if (requestedFiles && Object.keys(requestedFiles).length > 0) {
        // The name of the input field (i.e. "file") is used to retrieve the uploaded file
        if(requestedFiles.medicalReports){
            requestedFiles.medicalReports.forEach( async (requestedFile: any) => {
                // file = requestedFile.file;
                file = requestedFile;
                fileType = file.mimetype;
                
                file_extension = extname(file.name);
                const newFileName = (new Date().getTime()) + Math.random().toString(20).substring(2, 12) + file_extension;
    
                // Check if the uploaded file is allowed
                if (PHOTO_COLLECTION.filter(function(v) {return ( v.file == file_extension && v.type == fileType )}).length > 0) {
                    dir = 'uploads/photo/';
                    file_type = 'photo';
                } else if (FILE_COLLECTION.filter(function(v) {return ( v.file == file_extension && v.type == fileType )}).length > 0) {
                    dir = 'uploads/file/';
                    file_type = 'file';
                } else {
                    return res.status(400).send({
                        status: false,
                        message: ' Only Photos and Files are allowed',
                        file_extension,
                        fileType,
                    })
                }
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir, { recursive: true });
                }
                uploadPath = dir + newFileName;
                // Use the mv() method to place the file somewhere on your server
                file.mv(uploadPath, function(err:any) {
                    if (err)
                    return res.status(500).send(err);
                });
    
                const patientMedicalRecords = await repositoryPatientMedicalRecords.save(
                    {
                        file:uploadPath,
                        file_type:fileType,
                        patient: {
                            id: patient.id
                        }
                    }
                )
            });
            // return res.status(200).send({"requestedFiles":requestedFiles.medicalReports})
        }
    }

    return res.status(201).send({
        status: true,
        message: 'Patient created!',
        patient
    })
}


export const UpdatePatient = async (req: Request, res: Response) => {
    const user = req['user'];
    const id : any = req.params.id;
    const { patient_id, ...body } = req.body;
    const update = await repository.update(req.params.id, {
        ...body,
        patient: {
            id: patient_id
        },
        creator: {
            id: user.id
        }
    })
    
    const patient = await repository.findOne({ 
        where: { id: id },
        relations: ['patient','creator']
    })
    res.send({ patient })
}

export const DeletePatient = async (req: Request, res: Response) => {
    const deletePatient = await repository.delete(req.params.id)
    
    res.status(200).send(deletePatient)
}