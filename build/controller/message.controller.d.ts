import { Request, Response } from "express";
export declare const Messages: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const CreateMessage: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const readMessage: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
