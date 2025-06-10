import { Request, Response } from "express";
import { Manager } from "../app-data-source";
import { Permission } from "../entities/permission.entity";

const repository = Manager.getRepository(Permission);

export const Permissions = async (req: Request, res: Response) => {
    // pagination
    // only retrieve 15 items per page
    const take = parseInt(req.query.take as string || '15')
    const page = parseInt(req.query.page as string || '1')
    // find 'take' number of items starting from zero or (page-1)*take
    const [data, total] = await repository.findAndCount({
        take: take,
        skip: ( page - 1 ) * take
    })

    res.send({
        data,
        // also return active page, last page and total number of items
        meta: {
            total,
            page,
            last_page: Math.ceil(total / take)
        }
    })
    // res.send(await repository.find())
}