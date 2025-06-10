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
exports.ChartData = exports.ExportCsv = exports.GetOrders = void 0;
const json2csv_1 = require("json2csv");
const app_data_source_1 = require("../app-data-source");
const order_entity_1 = require("../entities/order.entity");
const repository = app_data_source_1.Manager.getRepository(order_entity_1.Order);
const GetOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // pagination
    // only retrieve 15 items per page
    const take = 15;
    const page = parseInt(req.query.page || '1');
    // find 'take' number of items starting from zero or (page-1)*take
    const [data, total] = yield repository.findAndCount({
        take: take,
        skip: (page - 1) * take,
        relations: ['order_items']
    });
    res.send({
        data: data.map((Order) => ({
            id: Order.id,
            name: Order.first_name + ' ' + Order.last_name,
            email: Order.email,
            total: Order.total,
            created_at: Order.created_at,
            order_items: Order.order_items
        })),
        // also return active page, last page and total number of items
        meta: {
            total,
            page,
            last_page: Math.ceil(total / take)
        }
    });
});
exports.GetOrders = GetOrders;
const ExportCsv = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parser = new json2csv_1.Parser({
        fields: ['ID', 'Name', 'Email', 'Product', 'Price', 'Quantity']
    });
    const orders = yield repository.find({ relations: ['order_items'] });
    const json = [];
    orders.forEach((order) => {
        json.push({
            ID: order.id,
            Name: order.first_name + ' ' + order.last_name,
            Email: order.email,
            Product: '',
            Price: '',
            Quantity: ''
        });
        order.order_items.forEach((item) => {
            json.push({
                ID: '',
                Name: '',
                Email: '',
                Product: item.product_title,
                Price: item.price,
                Quantity: item.quantity
            });
        });
    });
    const csv = parser.parse(json);
    res.header('Content-Type', 'text/csv');
    res.attachment('orders.csv');
    res.send(csv);
});
exports.ExportCsv = ExportCsv;
const ChartData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield app_data_source_1.Manager.query(`
        SELECT DATE_FORMAT(o.created_at, '%Y-%m-%d') as date, SUM(oi.price * oi.quantity) as sum
        FROM \`order\` o
            JOIN order_item oi
        on o.id = oi.order_id
        GROUP BY date
    `);
    res.send(result);
});
exports.ChartData = ChartData;
