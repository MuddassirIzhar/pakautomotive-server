"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeletePatient = exports.UpdatePatient = exports.CreatePatient = exports.GetPatient = exports.GetMyPatients = exports.GetPatients = void 0;
const path_1 = require("path");
const fs_1 = __importDefault(require("fs"));
const app_data_source_1 = require("../app-data-source");
const patient_care_team_entity_1 = require("../entities/patient-care-team.entity");
const patient_medical_records_entity_1 = require("../entities/patient-medical-records.entity");
const patient_entity_1 = require("../entities/patient.entity");
const repository = app_data_source_1.myDataSource.getRepository(patient_entity_1.Patient);
const repositoryPatientCareTeam = app_data_source_1.myDataSource.getRepository(patient_care_team_entity_1.PatientCareTeam);
const repositoryPatientMedicalRecords = app_data_source_1.myDataSource.getRepository(patient_medical_records_entity_1.PatientMedicalRecords);
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
const GetPatients = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // pagination
    // only retrieve 15 items per page
    const take = 15;
    const page = parseInt(req.query.page || '1');
    // find 'take' number of items starting from zero or (page-1)*take
    const [data, total] = yield repository.findAndCount({
        take: take,
        skip: (page - 1) * take,
        relations: {
            creator: true,
            care_team: true,
            medical_records: true
        }
    });
    res.send({
        data,
        // also return active page, last page and total number of items
        meta: {
            total,
            page,
            last_page: Math.ceil(total / take)
        }
    });
});
exports.GetPatients = GetPatients;
const GetMyPatients = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req['user'];
    // pagination
    // only retrieve 15 items per page
    const take = 15;
    const page = parseInt(req.query.page || '1');
    // find 'take' number of items starting from zero or (page-1)*take
    const [data, total] = yield repository.findAndCount({
        where: {
            creator: user.id,
        },
        take: take,
        skip: (page - 1) * take,
        relations: {
            creator: true,
            care_team: true,
            medical_records: true
        }
    });
    res.send({
        data,
        // also return active page, last page and total number of items
        meta: {
            total,
            page,
            last_page: Math.ceil(total / take)
        }
    });
});
exports.GetMyPatients = GetMyPatients;
const GetPatient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const patient = yield repository.findOne({
        where: { id: id },
        relations: {
            creator: true,
            care_team: true,
            medical_records: true
        }
    });
    res.send({ patient });
});
exports.GetPatient = GetPatient;
const CreatePatient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req['user'];
    const _a = req.body, { patient_id } = _a, body = __rest(_a, ["patient_id"]);
    const patient = yield repository.save(Object.assign(Object.assign({}, body), { creator: {
            id: user.id
        } }));
    const careTeam = JSON.parse(req.body.careTeam);
    careTeam.forEach((data, keyObj) => __awaiter(void 0, void 0, void 0, function* () {
        const patientCareTeam = yield repositoryPatientCareTeam.save({
            user: {
                id: data.value
            },
            patient: {
                id: patient.id
            }
        });
    }));
    let file_extension = null;
    let file;
    let file_type = null;
    let fileType = null;
    let uploadPath;
    let dir;
    const requestedFiles = req.files;
    if (requestedFiles && Object.keys(requestedFiles).length > 0) {
        // The name of the input field (i.e. "file") is used to retrieve the uploaded file
        if (requestedFiles.medicalReports) {
            requestedFiles.medicalReports.forEach((requestedFile) => __awaiter(void 0, void 0, void 0, function* () {
                // file = requestedFile.file;
                file = requestedFile;
                fileType = file.mimetype;
                file_extension = (0, path_1.extname)(file.name);
                const newFileName = (new Date().getTime()) + Math.random().toString(20).substring(2, 12) + file_extension;
                // Check if the uploaded file is allowed
                if (PHOTO_COLLECTION.filter(function (v) { return (v.file == file_extension && v.type == fileType); }).length > 0) {
                    dir = 'uploads/photo/';
                    file_type = 'photo';
                }
                else if (FILE_COLLECTION.filter(function (v) { return (v.file == file_extension && v.type == fileType); }).length > 0) {
                    dir = 'uploads/file/';
                    file_type = 'file';
                }
                else {
                    return res.status(400).send({
                        status: false,
                        message: ' Only Photos and Files are allowed',
                        file_extension,
                        fileType,
                    });
                }
                if (!fs_1.default.existsSync(dir)) {
                    fs_1.default.mkdirSync(dir, { recursive: true });
                }
                uploadPath = dir + newFileName;
                // Use the mv() method to place the file somewhere on your server
                file.mv(uploadPath, function (err) {
                    if (err)
                        return res.status(500).send(err);
                });
                const patientMedicalRecords = yield repositoryPatientMedicalRecords.save({
                    file: uploadPath,
                    file_type: fileType,
                    patient: {
                        id: patient.id
                    }
                });
            }));
            // return res.status(200).send({"requestedFiles":requestedFiles.medicalReports})
        }
    }
    return res.status(201).send({
        status: true,
        message: 'Patient created!',
        patient
    });
});
exports.CreatePatient = CreatePatient;
const UpdatePatient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req['user'];
    const id = req.params.id;
    const _b = req.body, { patient_id } = _b, body = __rest(_b, ["patient_id"]);
    const update = yield repository.update(req.params.id, Object.assign(Object.assign({}, body), { patient: {
            id: patient_id
        }, creator: {
            id: user.id
        } }));
    const patient = yield repository.findOne({
        where: { id: id },
        relations: ['patient', 'creator']
    });
    res.send({ patient });
});
exports.UpdatePatient = UpdatePatient;
const DeletePatient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const deletePatient = yield repository.delete(req.params.id);
    res.status(200).send(deletePatient);
});
exports.DeletePatient = DeletePatient;
