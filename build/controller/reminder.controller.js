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
exports.DeleteReminder = exports.UpdateReminder = exports.CreateReminder = exports.GetReminder = exports.GetMyReminders = exports.GetReminders = void 0;
const app_data_source_1 = require("../app-data-source");
const reminder_entity_1 = require("../entities/reminder.entity");
const repository = app_data_source_1.myDataSource.getRepository(reminder_entity_1.Reminder);
const GetReminders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // pagination
    // only retrieve 15 items per page
    const take = 15;
    const page = parseInt(req.query.page || '1');
    // find 'take' number of items starting from zero or (page-1)*take
    const [data, total] = yield repository.findAndCount({
        take: take,
        skip: (page - 1) * take,
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
exports.GetReminders = GetReminders;
const GetMyReminders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        relations: ['patient', 'creator']
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
exports.GetMyReminders = GetMyReminders;
const GetReminder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const reminder = yield repository.findOne({
        where: { id: id },
        relations: ['patient', 'creator']
    });
    res.send({ reminder });
});
exports.GetReminder = GetReminder;
const CreateReminder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req['user'];
    const _a = req.body, { patient_id } = _a, body = __rest(_a, ["patient_id"]);
    const reminder = yield repository.save(Object.assign(Object.assign({}, body), { patient: {
            id: patient_id
        }, creator: {
            id: user.id
        } }));
    res.status(201).send(reminder);
});
exports.CreateReminder = CreateReminder;
const UpdateReminder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req['user'];
    const id = req.params.id;
    const _b = req.body, { patient_id } = _b, body = __rest(_b, ["patient_id"]);
    const update = yield repository.update(req.params.id, Object.assign(Object.assign({}, body), { patient: {
            id: patient_id
        }, creator: {
            id: user.id
        } }));
    const reminder = yield repository.findOne({
        where: { id: id },
        relations: ['patient', 'creator']
    });
    res.send({ reminder });
});
exports.UpdateReminder = UpdateReminder;
const DeleteReminder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const deleteReminder = yield repository.delete(req.params.id);
    res.status(200).send(deleteReminder);
});
exports.DeleteReminder = DeleteReminder;
