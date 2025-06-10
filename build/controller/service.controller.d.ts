import { Request, Response } from "express";
export declare const GetServices: (req: Request, res: Response) => Promise<void>;
export declare const GetService: (req: Request, res: Response) => Promise<void>;
export declare const CreateService: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const UpdateService: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const DeleteService: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
