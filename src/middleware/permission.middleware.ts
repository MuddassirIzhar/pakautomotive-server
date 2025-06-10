import { Request, Response } from 'express';
import { User } from '../entities/user.entity';

export const CheckPermissions = (access: string) => {
    return (req: Request, res: Response, next: Function) => {
        // const user: User = req['user'];
        const user: User = req['user'];
        
        // debug
        // console.log(req)
        // console.log(req['user'])
        // console.log(user)

        // get permissions array
        const permissions = user.role.permissions
        // const permissions: string | any[] = []

        // loop though array of objects and get permClasses
        const permClasses = []

        for (let i = 0; i < permissions.length; i++) {
            permClasses.push(permissions[i].name)
          }

        // debug
        // console.log(permClasses)

        // if route is GET require `view_` or `edit_` perm else you need `edit_`
        if  (req.method === 'GET') {
            if(!permClasses.includes('view_' + access) || !permClasses.includes('edit_' + access)) {
                return res.status(401).send({
                    message: 'ERROR :: Unauthorized!'
                })
        } else {
            if(!permClasses.includes('edit_' + access)) {
                return res.status(401).send({
                    message: 'ERROR :: Unauthorized!'
                })
            }
        }}

        next()
    }
}