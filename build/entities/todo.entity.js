"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Todo = exports.PriorityEnum = void 0;
const typeorm_1 = require("typeorm");
const patient_entity_1 = require("./patient.entity");
const user_entity_1 = require("./user.entity");
var PriorityEnum;
(function (PriorityEnum) {
    PriorityEnum["HIGH"] = "high";
    PriorityEnum["MEDIUM"] = "medium";
    PriorityEnum["LOW"] = "low";
})(PriorityEnum || (exports.PriorityEnum = PriorityEnum = {}));
let Todo = class Todo extends typeorm_1.BaseEntity {
};
exports.Todo = Todo;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Todo.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => patient_entity_1.Patient),
    (0, typeorm_1.JoinColumn)({ name: 'patient_id' }),
    __metadata("design:type", patient_entity_1.Patient)
], Todo.prototype, "patient", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Todo.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", String)
], Todo.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: PriorityEnum,
        default: [PriorityEnum.LOW]
    }),
    __metadata("design:type", Array)
], Todo.prototype, "priority", void 0);
__decorate([
    (0, typeorm_1.Column)("boolean"),
    __metadata("design:type", Boolean)
], Todo.prototype, "waitlist", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], Todo.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'creator_id' }),
    __metadata("design:type", user_entity_1.User)
], Todo.prototype, "creator", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" }),
    __metadata("design:type", Object)
], Todo.prototype, "created_at", void 0);
exports.Todo = Todo = __decorate([
    (0, typeorm_1.Entity)("todos")
], Todo);
