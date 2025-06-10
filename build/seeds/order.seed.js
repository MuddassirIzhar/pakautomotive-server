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
exports.orderSeed = void 0;
const faker_1 = require("@faker-js/faker");
const order_entity_1 = require("../entities/order.entity");
const crypto_1 = require("crypto");
const order_item_entity_1 = require("../entities/order-item.entity");
const app_data_source_1 = require("../app-data-source");
const orderSeed = () => __awaiter(void 0, void 0, void 0, function* () {
    const orderRepository = app_data_source_1.Manager.getRepository(order_entity_1.Order);
    const orderItemsRepository = app_data_source_1.Manager.getRepository(order_item_entity_1.OrderItem);
    // generate 30 fake orders
    for (let i = 0; i < 30; i++) {
        const order = yield orderRepository.save({
            first_name: faker_1.faker.person.firstName(),
            last_name: faker_1.faker.person.lastName(),
            email: faker_1.faker.internet.email(),
            total: parseInt(faker_1.faker.finance.amount({ min: 500, max: 1000, dec: 2 })),
            created_at: faker_1.faker.date.recent({ days: 10, refDate: '2023-06-10T00:00:00.000Z' })
        });
        console.log(order);
        // add number of items in order
        for (let j = 0; j < (0, crypto_1.randomInt)(1, 5); j++) {
            yield orderItemsRepository.save({
                product_title: faker_1.faker.lorem.words(2),
                price: parseInt(faker_1.faker.finance.amount({ min: 500, max: 1000, dec: 2 })),
                quantity: parseInt(faker_1.faker.finance.amount({ min: 1, max: 5, dec: 0 })),
                order: order
            });
        }
    }
});
exports.orderSeed = orderSeed;
