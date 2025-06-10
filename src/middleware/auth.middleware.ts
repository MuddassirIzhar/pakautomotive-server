import { Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

import { myDataSource } from '../app-data-source';
import { User } from '../entities/user.entity';
const secret = process.env.SECRET_KEY || 'NQILua/fWC9a0UQw68IGEc9HrNKRgMOYm/p84N2rjn0='

const repository = myDataSource.getRepository(User);

export const CheckAuthState = async (req: Request, res: Response, next: Function) => {
    
        try {
            // get cookie from authenticated user
            // const jwt = req.cookies['jwt'];
            const jwt = req.cookies['refreshToken'];
            // get user id from jwt
            const payload: any = verify(jwt, secret)

            if(!payload) {
                return res.status(401).send({
                    message: 'ERROR :: User unauthenticated!'
                })
            }
            // return user info  for user id
            // req['user'] = await repository.findOneBy(payload.id)
            const id = payload.user.id;
            req['user'] = await repository.findOne({
                where: {
                    id: id
                },
                relations: {
                    role: {
                        permissions:true
                    },
                },
            })
            next();

        } catch (e) {
            return res.status(401).send({
                message: 'ERROR :: User unauthenticated!'
        })
    }
}