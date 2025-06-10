import { Request, RequestHandler, Response } from 'express';
export declare const Register: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const Login: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const AuthenticatedUser: (req: Request, res: Response) => Promise<void>;
export declare const Logout: (req: Request, res: Response) => Promise<void>;
export declare const UpdateUserInfo: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const UpdateUserPass: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const UpdateUserEmail: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const ValidateRefreshToken: RequestHandler;
