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
Object.defineProperty(exports, "__esModule", { value: true });
exports.productSeed = void 0;
const faker_1 = require("@faker-js/faker");
const app_data_source_1 = require("../app-data-source");
const product_entity_1 = require("../entities/product.entity");
const productSeed = () => __awaiter(void 0, void 0, void 0, function* () {
    // create role permissions
    const productRepository = app_data_source_1.Manager.getRepository(product_entity_1.Product);
    // generate 30 fake items
    for (let i = 0; i < 30; i++) {
        // use upsert instead of save
        yield productRepository.upsert({
            title: faker_1.faker.lorem.words(2),
            description: faker_1.faker.lorem.words(10),
            image: faker_1.faker.image.url({ width: 200, height: 200 }),
            price: parseInt(faker_1.faker.finance.amount({ min: 500, max: 1000, dec: 2 }))
        }, 
        // if name exists only update else insert
        ['title']);
    }
});
exports.productSeed = productSeed;
