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
exports.Patient = void 0;
const typeorm_1 = require("typeorm");
const patient_care_team_entity_1 = require("./patient-care-team.entity");
const patient_medical_records_entity_1 = require("./patient-medical-records.entity");
const user_entity_1 = require("./user.entity");
let Patient = class Patient extends typeorm_1.BaseEntity {
};
exports.Patient = Patient;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Patient.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Patient.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Patient.prototype, "dob", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Patient.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Patient.prototype, "anotherAddress", void 0);
__decorate([
    (0, typeorm_1.Column)("text"),
    __metadata("design:type", String)
], Patient.prototype, "details", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'creator_id' }),
    __metadata("design:type", user_entity_1.User)
], Patient.prototype, "creator", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" }),
    __metadata("design:type", Object)
], Patient.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" }),
    __metadata("design:type", Object)
], Patient.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => patient_care_team_entity_1.PatientCareTeam, PatientCareTeam => PatientCareTeam.patient),
    __metadata("design:type", Array)
], Patient.prototype, "care_team", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => patient_medical_records_entity_1.PatientMedicalRecords, PatientMedicalRecords => PatientMedicalRecords.patient),
    __metadata("design:type", Array)
], Patient.prototype, "medical_records", void 0);
exports.Patient = Patient = __decorate([
    (0, typeorm_1.Entity)("patients")
], Patient);
