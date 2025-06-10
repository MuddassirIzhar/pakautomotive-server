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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileUpload = exports.DeleteRole = exports.UpdateRole = exports.GetRole = exports.CreateRole = exports.Roles = void 0;
const app_data_source_1 = require("../app-data-source");
const role_entity_1 = require("../entities/role.entity");
const multer_1 = __importDefault(require("multer"));
const path_1 = require("path");
const repository = app_data_source_1.Manager.getRepository(role_entity_1.Role);
const Roles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send(yield repository.find({ relations: ['permissions'] }));
});
exports.Roles = Roles;
const CreateRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, permissions } = req.body;
    const role = yield repository.save({
        name,
        permissions: permissions.map((id) => {
            return {
                id: id
            };
        })
    });
    res.send(role);
});
exports.CreateRole = CreateRole;
const GetRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send(yield repository.findOne({
        where: { id: req.params.id }, relations: ['permissions']
    }));
});
exports.GetRole = GetRole;
const UpdateRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, permissions } = req.body;
    const role = yield repository.save({
        id: parseInt(req.params.id),
        name,
        permissions: permissions.map((id) => {
            return {
                id: id
            };
        })
    });
    res.status(202).send(role);
});
exports.UpdateRole = UpdateRole;
const DeleteRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const deleteRole = yield repository.delete(req.params.id);
    // res.status(204).send(deleteRole)
    res.status(200).send(deleteRole);
});
exports.DeleteRole = DeleteRole;
const FileUpload = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const storage = multer_1.default.diskStorage({
        destination: './uploads',
        filename(_, file, cb) {
            const randomName = Math.random().toString(20).substring(2, 12);
            return cb(null, `${randomName}${(0, path_1.extname)(file.originalname)}`);
        }
    });
    const upload = (0, multer_1.default)({ storage }).single('image');
    upload(req, res, (err) => {
        var _a;
        if (err) {
            return res.send(400).send(err);
        }
        res.send({ url: `http://localhost:8080/api/uploads/${(_a = req === null || req === void 0 ? void 0 : req.file) === null || _a === void 0 ? void 0 : _a.filename}` });
    });
});
exports.FileUpload = FileUpload;
