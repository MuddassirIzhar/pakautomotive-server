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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteService = exports.UpdateService = exports.CreateService = exports.GetService = exports.GetServices = void 0;
const app_data_source_1 = require("../app-data-source");
const service_entity_1 = require("../entities/service.entity");
const repository = app_data_source_1.myDataSource.getRepository(service_entity_1.Service);
const GetServices = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // pagination
    // only retrieve 15 items per page
    const take = parseInt(req.query.take || '15');
    const page = parseInt(req.query.page || '1');
    // find 'take' number of items starting from zero or (page-1)*take
    const [data, total] = yield repository.findAndCount({
        take: take,
        skip: (page - 1) * take
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
exports.GetServices = GetServices;
const GetService = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const serviceData = yield repository.findOne({
        where: { id: id }
    });
    res.send({ serviceData });
});
exports.GetService = GetService;
const CreateService = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // check if service exists in db
    const existingService = yield repository.findOneBy({
        name: req.body.name
    });
    // if does not exists break
    if (existingService) {
        return res.status(409).send({
            message: 'Service aleady exists!'
        });
    }
    const body = __rest(req.body, []);
    const service = yield repository.save(Object.assign({}, body));
    // res.status(201).send(service)
    return res.status(201).json({
        message: 'Service Created Successfully!'
    });
});
exports.CreateService = CreateService;
const UpdateService = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // check if service exists in db
    const serviceCheck = yield repository.findOneBy({
        name: req.body.name
    });
    const id = parseInt(req.params.id);
    // if does not exists break
    if (serviceCheck && serviceCheck.id !== id) {
        return res.status(404).send({
            message: 'ERROR :: Service already exists!'
        });
    }
    const body = __rest(req.body, []);
    const update = yield repository.update(req.params.id, Object.assign({}, body));
    return res.status(202).json({
        message: 'Service Updated Successfully!'
    });
});
exports.UpdateService = UpdateService;
const DeleteService = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield repository.delete(req.params.id);
    return res.status(200).json({
        message: 'Service Deleted Successfully!'
    });
});
exports.DeleteService = DeleteService;
