import { Request, Response } from "express";
import { Parser } from "json2csv";
import { Manager } from "../app-data-source";
import { OrderItem } from "../entities/order-item.entity";

import { Order } from "../entities/order.entity";
const repository = Manager.getRepository(Order);


export const GetOrders = async (req: Request, res: Response) => {
    // pagination
    // only retrieve 15 items per page
    const take = 15
    const page = parseInt(req.query.page as string || '1')
    // find 'take' number of items starting from zero or (page-1)*take
    const [data, total] = await repository.findAndCount({
        take: take,
        skip: ( page - 1 ) * take,
        relations: ['order_items']
    })

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
    })
}
export const ExportCsv = async (req: Request, res: Response) => {
    const parser = new Parser({
        fields: ['ID', 'Name', 'Email', 'Product', 'Price', 'Quantity']
    })

    const orders = await repository.find({relations: ['order_items']})

    const json : any = []

    orders.forEach((order:Order) => {
        json.push({
            ID: order.id,
            Name: order.first_name + ' ' + order.last_name,
            Email: order.email,
            Product: '',
            Price: '',
            Quantity: ''
        })

        order.order_items.forEach((item: OrderItem) => {
            json.push({
                ID: '',
                Name: '',
                Email: '',
                Product: item.product_title,
                Price: item.price,
                Quantity: item.quantity
            })
        })
    })

    const csv = parser.parse(json)

    res.header('Content-Type', 'text/csv')
    res.attachment('orders.csv')
    res.send(csv)
}

export const ChartData = async (req: Request, res: Response) => {
    const result = await Manager.query(`
        SELECT DATE_FORMAT(o.created_at, '%Y-%m-%d') as date, SUM(oi.price * oi.quantity) as sum
        FROM \`order\` o
            JOIN order_item oi
        on o.id = oi.order_id
        GROUP BY date
    `)

    res.send(result)
}
