"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerValidation = void 0;
const express_validation_1 = require("express-validation");
exports.registerValidation = express_validation_1.Joi.object({
    firstName: express_validation_1.Joi.string().required(),
    lastName: express_validation_1.Joi.string().required(),
    email: express_validation_1.Joi.string().email().required(),
    password: express_validation_1.Joi.string().required(),
    passwordConfirmation: express_validation_1.Joi.string().required(),
});
