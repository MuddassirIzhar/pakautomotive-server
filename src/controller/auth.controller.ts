import { Request, RequestHandler, Response } from 'express';
// import Manager from '../db-connector';
// import { getRepository } from "typeorm";
import { User } from '../entities/user.entity';
import { registerValidation } from '../validation/register.validation';
import bcryptjs from "bcryptjs";
// import dataSource from "../db-connector";
// import { getRepository } from 'typeorm';
import { Manager } from '../app-data-source';
import { sign, verify } from 'jsonwebtoken';
import signJWT from '../functions/signJWT.function';
// import signJWT from './functions/signJWT.function';
const secret = process.env.SECRET_KEY || 'NQILua/fWC9a0UQw68IGEc9HrNKRgMOYm/p84N2rjn0='

const repository = Manager.getRepository(User);

// REGISTER USER
export const Register = async (req: Request, res: Response) => {
    const body = req.body;

    // check if all infos were send
    const { error } = registerValidation.validate(body);
    // break if something is missing
    if (error) {
        return res.status(400).send(error.details);
    }
    // verify that password is confirmed
    if (body.password !== body.passwordConfirmation) {
        return res.status(400).send({
            message: 'ERROR :: Passwords do not match!'
        });
    }
    // check if user exists in db
    const existingUser = await repository.findOneBy(
        {
            email: req.body.email
        }
    )

    // if does not exists break
    if (existingUser) {
        return res.status(404).send({
            message: 'User aleady exists!'
        })
    }
    // save user to database

    const { password, ...user } = await repository.save({
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        password: await bcryptjs.hash(body.password, 10),
        role: {
            id: 1
        }
    })

    return res.status(201).json({
        message: 'You have registered successfully!'
    });
    res.send(user);
};


// LOGIN USER
export const Login = async (req: Request, res: Response) => {
    // check if user exists in db
    // const user = await repository.findOneBy(
    //     {
    //         email: req.body.email
    //     }
    // )
    const user = await repository.findOne({
        select: ['id', 'firstName', 'lastName', 'email', 'password'],
        where: { email: req.body.email },
    })

    // if does not exists break
    if (!user) {
        return res.status(404).send({
            message: 'ERROR :: User does not exists!'
        })
    }


    if (user) {

        bcryptjs.compare(req.body.password, user.password, async (error, result) => {
            if (error) {
                res.status(500).send({
                    message: error.message
                });
            }
            else if (result) {
                let accessToken: any, refreshToken: any;

                const payload = { id: user.id }
                const token = sign(payload, secret)
                signJWT(user, 'access', (_error, result) => {
                    if (_error) {
                        res.status(500).send({
                            message: "unable to sign JWT token"
                        });
                    }
                    accessToken = result;
                    signJWT(user, 'refresh', (_error, _result) => {
                        if (_error) {
                            res.status(500).send({
                                message: "unable to sign JWT token"
                            });
                        }
                        refreshToken = _result;


                        res.status(200)
                        // .cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'strict' })
                        .cookie('refreshToken', refreshToken, {
                            secure: true, 
                            httpOnly: true, 
                            sameSite: 'none',
                            // domain:"pakautomotive.com"
                        })
                            //.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'strict' })
                            //.header('Authorization', accessToken)
                            .send({
                                user,
                                refreshToken,
                                accessToken,
                                message:"successfully signed in"
                            });
                    });
                });
            } else {
                res.status(401).send({
                    message: `Invalid credentials`
                });
            }

        })
    }
    else{
        res.status(401).send({
            message: `Invalid credentials`
        });
    }
    // // if exists but password is wrong break
    // if (!await bcryptjs.compare(req.body.password, user.password)) {
    //     return res.status(404).send({
    //         message: 'ERROR :: Invalid credentials!'
    //     })
    // }

    // // return JWT to authenticated user
    // const payload = { id: user.id }
    // const token = sign(payload, secret)
    // res.cookie('jwt', token, {
    //     // keep cookie in node.js backend
    //     httpOnly: true,
    //     maxAge: 24 * 60 * 60 * 1000 //1day
    // })

    // res.send({
    //     message: 'INFO :: Successfully logged in.'
    // })

    // // don't return password after successful login
    // // const { password, ...data } = user;
    // res.send(token);
    // // // don't return password after successful login
    // // const { password, ...data } = user;
    // // res.send(user);




}

export const AuthenticatedUser = async (req: Request, res: Response) => {
    const { password, ...user } = req['user']
    // const user = req['user']
    res.send(user);
}


export const Logout = async (req: Request, res: Response) => {
    // res.cookie('jwt', '', { maxAge: 0 })
    res.cookie('refreshToken', '', { maxAge: 0 })

    res.send({
        message: 'INFO :: Successfully logged out.'
    })
}

// UPDATE USER INFO
export const UpdateUserInfo = async (req: Request, res: Response) => {

    const user = req['user'];

    if (!req.body.firstName) {
        return res.status(400).send({
            message: 'ERROR :: First Name is required!'
        });
    }
    if (!req.body.lastName) {
        return res.status(400).send({
            message: 'ERROR :: Last Name is required!'
        });
    }

    let accessToken: any, refreshToken: any;

    signJWT(user, 'access', (_error, result) => {
        if (_error) {
            res.status(500).send({
                message: "unable to sign JWT token"
            });
        }
        accessToken = result;
        signJWT(user, 'refresh', async (_error, _result) => {
            if (_error) {
                res.status(500).send({
                    message: "unable to sign JWT token"
                });
            }
            refreshToken = _result;


            try {

                await repository.update(user.id, req.body)
        
                const userData = await repository.findOneBy(user.id)
        
                if (!!userData) {
                    const { password, ...data } = userData;
                    res.status(200)
                        // .cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'strict' })
                        .cookie('refreshToken', refreshToken, {
                            secure: true, 
                            httpOnly: false, 
                            sameSite: 'none',
                            // domain:"pakautomotive.com"
                        })
                        //.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'strict' })
                        //.header('Authorization', accessToken)
                        .send({
                            user:data,
                            refreshToken,
                            accessToken,
                            message:"info updated successfully"
                        });
                }
            } catch (e) {
                res.status(500).send({
                    message: e
                });
            }
        });
    });
}

// UPDATE USER PASSWORD
export const UpdateUserPass = async (req: Request, res: Response) => {

    const user = req['user'];

    // verify that password is confirmed
    if (req.body.password !== req.body.passwordConfirmation) {
        return res.status(400).send({
            message: 'ERROR :: Passwords do not match!'
        });
    }

    bcryptjs.compare(req.body.currentPassword, user.password, async (error, result) => {
        if (error) {
            res.status(500).send({
                message: error.message
            });
        }
        else if (result) {


            let accessToken: any, refreshToken: any;

            signJWT(user, 'access', (_error, result) => {
                if (_error) {
                    res.status(500).send({
                        message: "unable to sign JWT token"
                    });
                }
                accessToken = result;
                signJWT(user, 'refresh', async (_error, _result) => {
                    if (_error) {
                        res.status(500).send({
                            message: "unable to sign JWT token"
                        });
                    }
                    refreshToken = _result;


                    try {
        
                        await repository.update(user.id, {
                            password: await bcryptjs.hash(req.body.password, 10)
                        })
                
                        const userData = await repository.findOneBy(user.id)
                
                        if (!!userData) {
                            const { password, ...data } = userData;
                            res.status(200)
                                // .cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'strict' })
                                .cookie('refreshToken', refreshToken, {
                                    secure: true, 
                                    httpOnly: false, 
                                    sameSite: 'none',
                                    // domain:"pakautomotive.com"
                                })
                                //.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'strict' })
                                //.header('Authorization', accessToken)
                                .send({
                                    user:data,
                                    refreshToken,
                                    accessToken,
                                    message:"email updated successfully"
                                });
                        }
                    } catch (e) {
                        res.status(500).send({
                            message: e
                        });
                    }
                });
            });
        } else {
            res.status(401).send({
                message: `Invalid current password`
            });
        }

    })

}


// UPDATE USER PASSWORD
export const UpdateUserEmail = async (req: Request, res: Response) => {

    const user = req['user'];

    // check if user exists in db
    const userCheck = await repository.findOneBy(
        {
            email: req.body.email
        }
    )

    // if does not exists break
    if (userCheck && userCheck.id !== user.id) {
        return res.status(404).send({
            message: 'ERROR :: Email not available!'
        })
    }


    bcryptjs.compare(req.body.password, user.password, async (error, result) => {
        if (error) {
            res.status(500).send({
                message: error.message
            });
        }
        else if (result) {


            let accessToken: any, refreshToken: any;

            signJWT(user, 'access', (_error, result) => {
                if (_error) {
                    res.status(500).send({
                        message: "unable to sign JWT token"
                    });
                }
                accessToken = result;
                signJWT(user, 'refresh', async (_error, _result) => {
                    if (_error) {
                        res.status(500).send({
                            message: "unable to sign JWT token"
                        });
                    }
                    refreshToken = _result;

                    try {
        
                        await repository.update(user.id, {
                            email: req.body.email
                        })
                
                        const userData = await repository.findOneBy(user.id)
                
                        if (!!userData) {
                            const { password, ...data } = userData;
                            res.status(200)
                            // .cookie('refreshToken', refreshToken, { httpOnly: true, domain: process.env.NODE_ENV === 'development' ? '.localhost' : '.vercel.app' })
                                // .cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'strict' })
                        .cookie('refreshToken', refreshToken, {
                            secure: true, 
                            httpOnly: false, 
                            sameSite: 'none',
                            // domain:"pakautomotive.com",
                            // domain: process.env.NODE_ENV === 'development' ? '.localhost' : '.vercel.app'
                        })
                                //.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'strict' })
                                //.header('Authorization', accessToken)
                                .send({
                                    user:data,
                                    refreshToken,
                                    accessToken,
                                    message:"email updated successfully"
                                });
                        }
                    } catch (e) {
                        res.status(500).send({
                            message: e
                        });
                    }
                });
            });



        } else {
            res.status(401).send({
                message: `Invalid password`
            });
        }

    })

}

export const ValidateRefreshToken: RequestHandler = (req, res, next) => {
    return res.status(200).json({
        message: 'Refresh Token Authorized'
    });
};