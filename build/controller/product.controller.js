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
exports.DeleteProduct = exports.UpdateProduct = exports.GetProduct = exports.CreateProduct = exports.GetProducts = void 0;
const app_data_source_1 = require("../app-data-source");
const product_entity_1 = require("../entities/product.entity");
const repository = app_data_source_1.myDataSource.getRepository(product_entity_1.Product);
const GetProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // pagination
    // only retrieve 15 items per page
    const take = 15;
    const page = parseInt(req.query.page || '1');
    // find 'take' number of items starting from zero or (page-1)*take
    const [data, total] = yield repository.findAndCount({
        take: take,
        skip: (page - 1) * take
    });
    res.send({
        data: data,
        // also return active page, last page and total number of items
        meta: {
            total,
            page,
            last_page: Math.ceil(total / take)
        }
    });
});
exports.GetProducts = GetProducts;
const CreateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield repository.save(req.body);
    res.status(201).send(product);
});
exports.CreateProduct = CreateProduct;
const GetProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send(yield repository.findOne({
        where: { id: parseInt(req.params.id) }
    }));
});
exports.GetProduct = GetProduct;
const UpdateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield repository.update(parseInt(req.params.id), req.body);
    res.status(202).send(yield repository.findOne({
        where: { id: parseInt(req.params.id) }
    }));
});
exports.UpdateProduct = UpdateProduct;
const DeleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const deleteProduct = yield repository.delete(req.params.id);
    res.status(204).send(deleteProduct);
});
exports.DeleteProduct = DeleteProduct;
