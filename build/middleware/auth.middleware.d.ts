import { Request, Response } from 'express';
export declare const CheckAuthState: (req: Request, res: Response, next: Function) => Promise<Response<any, Record<string, any>> | undefined>;
