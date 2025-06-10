import { Request, Response } from 'express';
export declare const CheckPermissions: (access: string) => (req: Request, res: Response, next: Function) => Response<any, Record<string, any>> | undefined;
