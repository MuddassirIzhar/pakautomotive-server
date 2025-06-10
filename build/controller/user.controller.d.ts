import { Request, Response } from "express";
export declare const GetUsers: (req: Request, res: Response) => Promise<void>;
export declare const GetUser: (req: Request, res: Response) => Promise<void>;
export declare const CreateUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const UpdateUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const DeleteUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
