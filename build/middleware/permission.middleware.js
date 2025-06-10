"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckPermissions = void 0;
const CheckPermissions = (access) => {
    return (req, res, next) => {
        // const user: User = req['user'];
        const user = req['user'];
        // debug
        // console.log(req)
        // console.log(req['user'])
        // console.log(user)
        // get permissions array
        const permissions = user.role.permissions;
        // const permissions: string | any[] = []
        // loop though array of objects and get permClasses
        const permClasses = [];
        for (let i = 0; i < permissions.length; i++) {
            permClasses.push(permissions[i].name);
        }
        // debug
        // console.log(permClasses)
        // if route is GET require `view_` or `edit_` perm else you need `edit_`
        if (req.method === 'GET') {
            if (!permClasses.includes('view_' + access) || !permClasses.includes('edit_' + access)) {
                return res.status(401).send({
                    message: 'ERROR :: Unauthorized!'
                });
            }
            else {
                if (!permClasses.includes('edit_' + access)) {
                    return res.status(401).send({
                        message: 'ERROR :: Unauthorized!'
                    });
                }
            }
        }
        next();
    };
};
exports.CheckPermissions = CheckPermissions;
