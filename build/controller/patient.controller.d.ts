import { Request, Response } from "express";
export declare const GetPatients: (req: Request, res: Response) => Promise<void>;
export declare const GetMyPatients: (req: Request, res: Response) => Promise<void>;
export declare const GetPatient: (req: Request, res: Response) => Promise<void>;
export declare const CreatePatient: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const UpdatePatient: (req: Request, res: Response) => Promise<void>;
export declare const DeletePatient: (req: Request, res: Response) => Promise<void>;
